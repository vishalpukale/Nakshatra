/**
 * ---------------------------------
 * File: emailTemplates.js
 * Description:
 * This file contains a function that returns dynamic email templates based on a provided key. 
 * It supports both plain text and HTML versions of the templates, allowing for customized 
 * email content by inserting dynamic values through a `data` object. 
 * The templates include common use cases such as OTP generation, site visit notifications, 
 * video KYC scheduling, and KYC approval notifications.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - Ensure that the `data` object contains the required fields (e.g., `otp`, `userName`) 
 *   for the template to be populated correctly.
 * - Extend the `templates` object to add more email templates as needed.
 * ---------------------------------
 */



/**
 * Get email template by key
 * @param {string} key - Template key
 * @param {object} data - Dynamic data to insert
 * @returns {object} { text: "...", html: "..." }
 */
function getEmailTemplate(key, data = {}) {
    const templates = {
        otp: {
            text: `Dear User,\n\nHere is your OTP: ${data.otp}\n\nPlease do not share this OTP with anyone.`,
            html: `<p>Dear User,</p><p>Here is your <strong>OTP: ${data.otp}</strong></p><p>Please do not share this OTP with anyone.</p>`,
        },
    };

    return templates[key] || { text: "No template found", html: "<p>No template found</p>" };
}

module.exports = { getEmailTemplate };
