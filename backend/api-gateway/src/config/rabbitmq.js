/**
 * ---------------------------------
 * File: RabbitMQClient.js
 * Description:
 * This class manages communication with RabbitMQ, handling connection, 
 * channel creation, request/response messaging, and error recovery. It provides 
 * methods to send requests to RabbitMQ queues, await responses, and handle automatic 
 * reconnections in case of failure.
 * 
 * Dependencies:
 * - `amqplib`: A library for interacting with RabbitMQ via AMQP protocol.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - This class supports multiple queues (e.g., claim, policy, and replies) for various messaging workflows.
 * - The `sendRequestAndWaitResponse` method uses a correlation ID to uniquely identify each request and its response.
 * - The class supports reconnection attempts up to a specified limit (default: 5 attempts).
 * - The `close` method ensures that all RabbitMQ resources are cleaned up properly.
 * 
 */









const amqp = require("amqplib");

class RabbitMQClient {
  // Constructor to initialize properties for managing connection, queues, 
  // reconnect attempts, and response handling in the messaging system.
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queues = {
      claim: "claim-requests",
      poilcy: "policy-requests",
      replies: "reply-queue",
      // Add more queues as needed
    };
    this.isConnecting = false;
    this.replyQueueConsumer = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000; // 5 seconds
    this.responseListeners = new Map();
    this.correlationCounter = 0;
  }

  // Generates a unique correlation ID by combining the current timestamp with an incremented counter.
  generateCorrelationId() {
    this.correlationCounter = (this.correlationCounter + 1) % 1000000;
    return `${Date.now()}-${this.correlationCounter}`;
  }

  // Asynchronously connects to RabbitMQ, handling connection and channel creation, 
  // automatic reconnection attempts, and queue assertions with error handling.
  async connect() {
    if (this.isConnecting) {
      console.log("Already connecting to RabbitMQ...");
      return;
    }

    this.isConnecting = true;
    try {
      if (!this.connection || this.connection.closed) {
        console.log("Connecting to RabbitMQ...");

        // Connection options from environment variables
        const options = {
          protocol: "amqp",
          hostname: process.env.RABBITMQ_HOST || "localhost",
          port: parseInt(process.env.RABBITMQ_PORT) || 5672,
          vhost: process.env.RABBITMQ_VHOST || "/",
          username: process.env.RABBITMQ_USER || "guest",
          password: process.env.RABBITMQ_PASS || "guest",
          heartbeat: parseInt(process.env.RABBITMQ_HEARTBEAT) || 60,
        };

        console.log("RabbitMQ connection options:", {
          hostname: options.hostname,
          port: options.port,
          vhost: options.vhost,
          username: options.username,
        });

        try {
          this.connection = await amqp.connect(options);
          console.log("Successfully connected to RabbitMQ");
          this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        } catch (error) {
          console.error("Failed to connect to RabbitMQ:", error.message);
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(
              `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
            );
            await new Promise((resolve) =>
              setTimeout(resolve, this.reconnectDelay)
            );
            return this.connect();
          }
          throw error;
        }

        this.connection.on("error", (err) => {
          console.error("RabbitMQ Connection Error:", err.message);
          console.error("Error stack:", err.stack);
          this.handleConnectionError();
        });

        this.connection.on("close", () => {
          console.log("RabbitMQ Connection Closed");
          this.handleConnectionError();
        });
      }

      if (!this.channel || this.channel.closed) {
        console.log("Creating RabbitMQ channel...");
        try {
          this.channel = await this.connection.createChannel();
          console.log("RabbitMQ channel created successfully");
        } catch (error) {
          console.error("Failed to create channel:", error.message);
          throw error;
        }

        this.channel.on("error", (err) => {
          console.error("RabbitMQ Channel Error:", err.message);
          console.error("Error stack:", err.stack);
          this.handleChannelError();
        });

        this.channel.on("close", () => {
          console.log("RabbitMQ Channel Closed");
          this.handleChannelError();
        });

        // Assert all queues with proper error handling
        for (const [key, queue] of Object.entries(this.queues)) {
          try {
            await this.channel.assertQueue(queue, {
              durable: true,
              autoDelete: false,
            });
            console.log(`Queue ${queue} asserted successfully`);
          } catch (error) {
            console.error(`Failed to assert queue ${queue}:`, error.message);
            console.error("Queue assertion error stack:", error.stack);
            throw error;
          }
        }
      }

      console.log("Connected to RabbitMQ");
      this.isConnecting = false;
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error.message);
      console.error("Connection error stack:", error.stack);
      this.isConnecting = false;
      this.connection = null;
      this.channel = null;
      throw error;
    }
  }

  // Handles connection errors by resetting connection properties and 
  // attempting to reconnect to RabbitMQ, with a limit on the number of retry attempts.
  async handleConnectionError() {
    console.log("Handling connection error...");
    this.isConnecting = false;
    this.connection = null;
    this.channel = null;
    this.replyQueueConsumer = null;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );
      await new Promise((resolve) => setTimeout(resolve, this.reconnectDelay));
      return this.connect();
    } else {
      console.error(
        "Max reconnection attempts reached. Please check RabbitMQ server status."
      );
    }
  }

  // Handles channel errors by resetting the channel and reply queue consumer, 
  // then attempts to reconnect to RabbitMQ.
  async handleChannelError() {
    console.log("Handling channel error...");
    this.channel = null;
    this.replyQueueConsumer = null;
    await this.connect();
  }

  // Sends a request to a specified queue in RabbitMQ, ensuring a connection and channel are available before sending the message.
  async sendRequest(queueName, request) {
    try {
      if (!this.channel || this.channel.closed) {
        await this.connect();
      }

      console.log(
        `Sending request to queue ${queueName}:`,
        JSON.stringify(request, null, 2)
      );

      // Send the request without waiting for response
      this.channel.sendToQueue(
        this.queues[queueName],
        Buffer.from(JSON.stringify(request)),
        {
          persistent: true,
        }
      );

      console.log(`Message sent to queue ${queueName}`);
    } catch (error) {
      console.error("Error in sendRequest:", error.message);
      console.error("Send request error stack:", error.stack);
      throw error;
    }
  }

  // Sends a request to a specified queue and waits for a response via a reply queue, 
  // using correlation IDs to match the request and response with timeout handling.
  async sendRequestAndWaitResponse(queueName, request) {
    try {
      if (!this.channel || this.channel.closed) {
        await this.connect();
      }

      return new Promise((resolve, reject) => {
        const correlationId = this.generateCorrelationId();
        const replyTo = this.queues.replies;

        console.log(
          `Setting up response listener for correlationId: ${correlationId}`
        );
        console.log(`Request details:`, {
          queue: queueName,
          replyTo,
          request: JSON.stringify(request, null, 2),
        });

        const timeoutId = setTimeout(() => {
          console.error(`Request timeout for correlationId: ${correlationId}`);
          if (this.replyQueueConsumer) {
            this.channel.cancel(this.replyQueueConsumer.consumerTag);
            this.replyQueueConsumer = null;
          }
          this.responseListeners.delete(correlationId);
          reject(new Error("Request timeout after 30 seconds"));
        }, 30000);

        // Store the response listener
        this.responseListeners.set(correlationId, (response) => {
          clearTimeout(timeoutId);
          this.responseListeners.delete(correlationId);
          resolve(response);
        });

        // Set up reply queue consumer first
        this.channel
          .consume(
            replyTo,
            (msg) => {
              if (!msg) {
                console.error("Received null message in reply queue");
                clearTimeout(timeoutId);
                this.responseListeners.delete(correlationId);
                reject(new Error("No message received"));
                return;
              }

              const msgCorrelationId = msg.properties.correlationId;
              const listener = this.responseListeners.get(msgCorrelationId);

              if (listener) {
                try {
                  const response = JSON.parse(msg.content.toString());
                  this.channel.ack(msg);
                  listener(response);
                } catch (error) {
                  console.error("Failed to parse response:", error.message);
                  this.channel.nack(msg, false, false);
                  reject(
                    new Error("Failed to parse response: " + error.message)
                  );
                }
              } else {
                // Message not for this request, requeue it
                this.channel.nack(msg, false, true);
              }
            },
            { noAck: false }
          )
          .then((consumer) => {
            this.replyQueueConsumer = consumer;
            console.log(`Listening for replies on queue ${replyTo}`);

            // Now send the request
            this.channel.sendToQueue(
              this.queues[queueName],
              Buffer.from(JSON.stringify(request)),
              {
                correlationId,
                replyTo,
                persistent: true,
                expiration: 30000,
              }
            );
            console.log(
              `Request sent to queue ${queueName} with correlationId ${correlationId}`
            );
          })
          .catch((error) => {
            console.error(
              "Error setting up reply queue consumer:",
              error.message
            );
            console.error("Consumer setup error stack:", error.stack);
            clearTimeout(timeoutId);
            this.responseListeners.delete(correlationId);
            reject(error);
          });
      });
    } catch (error) {
      console.error("Error in sendRequestAndWaitResponse:", error.message);
      console.error("Send request and wait response error stack:", error.stack);
      throw error;
    }
  }

  // Gracefully closes the RabbitMQ connection, channel, and reply queue consumer with proper cleanup and error handling.
  async close() {
    try {
      if (this.replyQueueConsumer) {
        console.log("Cancelling reply queue consumer");
        await this.channel.cancel(this.replyQueueConsumer.consumerTag);
        this.replyQueueConsumer = null;
      }
      if (this.channel) {
        console.log("Closing RabbitMQ channel");
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        console.log("Closing RabbitMQ connection");
        await this.connection.close();
        this.connection = null;
      }
      console.log("RabbitMQ connection closed");
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error.message);
      console.error("Close connection error stack:", error.stack);
      throw error;
    }
  }
}

// Create and export a singleton instance
const rabbitMQClient = new RabbitMQClient();
module.exports = rabbitMQClient;
