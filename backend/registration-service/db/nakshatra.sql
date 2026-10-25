--
-- PostgreSQL database dump
--

\restrict mgAmW1pi10x2bwexlSSHSfNH3ztGSaDmX13ReyJhyeG8BviU0xd9XW3mAf21VJn

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 15.14 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: booking_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.booking_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED'
);


--
-- Name: payment_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_method AS ENUM (
    'CARD',
    'UPI',
    'NET_BANKING',
    'WALLET'
);


--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


--
-- Name: role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.role AS ENUM (
    'SUPER_ADMIN',
    'ORGANIZER',
    'USER'
);


--
-- Name: ticket_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.ticket_status AS ENUM (
    'ACTIVE',
    'USED',
    'CANCELLED',
    'EXPIRED'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'USER',
    'ORGANIZER',
    'SUPER_ADMIN',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    full_name character varying(255),
    email character varying(150),
    phone character varying(20),
    is_active boolean DEFAULT true NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by character varying(255),
    updated_by character varying(255),
    first_name character varying(100),
    last_name character varying(100),
    password_hash character varying(255),
    role public.user_role DEFAULT 'USER'::public.user_role,
    email_verified boolean DEFAULT false
);


--
-- Name: text; Type: VIEW; Schema: drizzle; Owner: -
--

CREATE VIEW drizzle.text AS
 SELECT users.full_name,
    users.email
   FROM public.users;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    event_id integer NOT NULL,
    number_of_tickets integer NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status public.booking_status DEFAULT 'PENDING'::public.booking_status NOT NULL,
    booking_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: city; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.city (
    id bigint NOT NULL,
    state_id bigint,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by bigint,
    updated_by bigint,
    created_date timestamp without time zone DEFAULT now() NOT NULL,
    updated_date timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: city_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.city_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: city_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.city_id_seq OWNED BY public.city.id;


--
-- Name: country; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.country (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    phone_code character varying,
    is_deleted boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by bigint,
    updated_by bigint,
    created_date timestamp without time zone DEFAULT now() NOT NULL,
    updated_date timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: country_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.country_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.country_id_seq OWNED BY public.country.id;


--
-- Name: event_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_categories (
    id bigint NOT NULL,
    event_id bigint NOT NULL,
    category_name character varying(100) NOT NULL,
    parent_category_id bigint,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: event_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.event_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.event_categories_id_seq OWNED BY public.event_categories.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id bigint NOT NULL,
    state_id bigint,
    city_id bigint,
    name character varying(200) NOT NULL,
    code character varying(200) NOT NULL,
    description text,
    payment_required boolean DEFAULT false NOT NULL,
    price numeric(10,2),
    currency character varying(10) DEFAULT 'INR'::character varying,
    registration_till_date timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by character varying(255),
    updated_by character varying(255),
    image_url text,
    type character varying,
    organizer_id bigint,
    title character varying(255),
    location character varying(255),
    venue character varying(255),
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    total_seats integer DEFAULT 0,
    available_seats integer DEFAULT 0,
    category character varying(100),
    is_featured boolean DEFAULT false
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: gallery_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_images (
    id bigint NOT NULL,
    image_url text NOT NULL,
    caption character varying(255),
    placement character varying(20) DEFAULT 'gallery'::character varying NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: gallery_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gallery_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gallery_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gallery_images_id_seq OWNED BY public.gallery_images.id;


--
-- Name: inquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inquiries (
    id bigint NOT NULL,
    intent character varying(30) NOT NULL,
    full_name character varying(255),
    email character varying(150),
    phone character varying(20),
    organization character varying(255),
    city character varying(255),
    message text,
    accepted_terms boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: inquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inquiries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inquiries_id_seq OWNED BY public.inquiries.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_method character varying(50),
    transaction_id character varying(255),
    status public.payment_status DEFAULT 'PENDING'::public.payment_status NOT NULL,
    payment_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: registration_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registration_answers (
    id bigint NOT NULL,
    registration_id bigint NOT NULL,
    field_id bigint NOT NULL,
    value text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: registration_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.registration_answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: registration_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.registration_answers_id_seq OWNED BY public.registration_answers.id;


--
-- Name: registration_form_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registration_form_fields (
    id bigint NOT NULL,
    form_id bigint NOT NULL,
    field_key character varying(100) NOT NULL,
    label character varying(255) NOT NULL,
    input_type character varying(50) NOT NULL,
    is_required boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    options jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL
);


--
-- Name: registration_form_fields_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.registration_form_fields_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: registration_form_fields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.registration_form_fields_id_seq OWNED BY public.registration_form_fields.id;


--
-- Name: registration_forms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registration_forms (
    id bigint NOT NULL,
    state_id bigint,
    event_id bigint,
    name character varying(200) NOT NULL,
    is_default boolean DEFAULT true NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by character varying(255),
    updated_by character varying(255),
    version integer DEFAULT 1,
    is_template boolean DEFAULT false
);


--
-- Name: registration_forms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.registration_forms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: registration_forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.registration_forms_id_seq OWNED BY public.registration_forms.id;


--
-- Name: registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registrations (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    event_id bigint NOT NULL,
    state_id bigint,
    form_id bigint,
    audition_video_path character varying(500),
    file_name character varying(255),
    file_size bigint,
    file_type character varying(100),
    total_amount numeric(10,2) DEFAULT '0'::numeric,
    payment_status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    payment_reference character varying(100),
    payment_date timestamp without time zone,
    is_active boolean DEFAULT true NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by character varying(255),
    updated_by character varying(255)
);


--
-- Name: registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.registrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.registrations_id_seq OWNED BY public.registrations.id;


--
-- Name: site_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_content (
    key character varying(80) NOT NULL,
    value text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: state; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.state (
    id bigint NOT NULL,
    country_id bigint,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by bigint,
    updated_by bigint,
    created_date timestamp without time zone DEFAULT now() NOT NULL,
    updated_date timestamp without time zone DEFAULT now() NOT NULL,
    is_participating boolean DEFAULT false NOT NULL
);


--
-- Name: state_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.state_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: state_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.state_id_seq OWNED BY public.state.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tickets (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    ticket_number character varying(100) NOT NULL,
    qr_code text,
    status public.ticket_status DEFAULT 'ACTIVE'::public.ticket_status NOT NULL,
    used_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: city id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.city ALTER COLUMN id SET DEFAULT nextval('public.city_id_seq'::regclass);


--
-- Name: country id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.country ALTER COLUMN id SET DEFAULT nextval('public.country_id_seq'::regclass);


--
-- Name: event_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_categories ALTER COLUMN id SET DEFAULT nextval('public.event_categories_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: gallery_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_images ALTER COLUMN id SET DEFAULT nextval('public.gallery_images_id_seq'::regclass);


--
-- Name: inquiries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inquiries ALTER COLUMN id SET DEFAULT nextval('public.inquiries_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: registration_answers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registration_answers ALTER COLUMN id SET DEFAULT nextval('public.registration_answers_id_seq'::regclass);


--
-- Name: registration_form_fields id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registration_form_fields ALTER COLUMN id SET DEFAULT nextval('public.registration_form_fields_id_seq'::regclass);


--
-- Name: registration_forms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registration_forms ALTER COLUMN id SET DEFAULT nextval('public.registration_forms_id_seq'::regclass);


--
-- Name: registrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);


--
-- Name: state id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.state ALTER COLUMN id SET DEFAULT nextval('public.state_id_seq'::regclass);


--
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	fd1128dbb6fe9d36a38fb374d3e6098317574b1dabcf38d3c62590cd95b9c791	1765916995311
\.


--
-- Data for Name: city; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.city (id, state_id, name, code, is_deleted, is_active, created_by, updated_by, created_date, updated_date) FROM stdin;
2	1	Vijayawada	VJWD	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
3	1	Guntur	GNTR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
4	1	Nellore	NLLR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
5	1	Kurnool	KRNL	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
6	1	Tirupati	TPTY	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
7	1	Rajahmundry	RJMD	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
8	2	Itanagar	ITNG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
10	2	Pasighat	PSGT	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
11	2	Tawang	TWNG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
12	3	Guwahati	GUWT	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
13	3	Silchar	SLCR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
14	3	Dibrugarh	DBRG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
15	3	Jorhat	JRHT	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
16	3	Tezpur	TZPR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
17	4	Patna	PTNA	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
19	4	Bhagalpur	BHGP	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
20	4	Muzaffarpur	MZFP	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
21	4	Darbhanga	DRBG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
22	5	Raipur	RPR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
23	5	Bilaspur	BLSP	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
24	5	Durg	DRG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
25	5	Bhilai	BHLI	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
27	6	Panaji	PNJ	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
28	6	Margao	MRGO	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
29	6	Vasco da Gama	VSGM	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
30	6	Mapusa	MPSA	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
31	7	Ahmedabad	AHMD	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
32	7	Surat	SRT	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
34	7	Rajkot	RJKT	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
35	7	Bhavnagar	BHVG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
36	7	Jamnagar	JMNG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
37	8	Gurugram	GRGM	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
38	8	Faridabad	FRBD	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
39	8	Panipat	PNPT	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
40	8	Ambala	AMBL	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
42	9	Shimla	SHML	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
43	9	Manali	MNLI	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
44	9	Dharamshala	DRMS	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
45	9	Solan	SLN	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
46	10	Ranchi	RNCH	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
47	10	Jamshedpur	JMSD	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
48	10	Dhanbad	DHNB	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
50	11	Bengaluru	BLR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
51	11	Mysuru	MYS	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
52	11	Mangaluru	MNG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
53	11	Hubballi	HBL	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
54	11	Belagavi	BLGV	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
56	12	Kochi	KCHI	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
57	12	Kozhikode	KZKD	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
58	12	Thrissur	TRSR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
59	12	Alappuzha	ALPZ	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
60	13	Bhopal	BHPL	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
61	13	Indore	INDR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
62	13	Jabalpur	JBLP	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
63	13	Gwalior	GWLR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
64	13	Ujjain	UJIN	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
66	14	Pune	PUNE	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
67	14	Nagpur	NGPR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
68	14	Nashik	NSHK	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
69	14	Aurangabad	AURG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
70	14	Thane	THNE	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
71	15	Imphal	IMPH	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
72	15	Thoubal	THBL	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
74	16	Tura	TURA	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
75	17	Aizawl	AZWL	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
76	17	Lunglei	LNGL	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
77	18	Kohima	KHMA	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
78	18	Dimapur	DMPR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
79	19	Bhubaneswar	BHBN	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
80	19	Cuttack	CTCK	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
82	19	Berhampur	BRMP	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
83	20	Chandigarh	CHDG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
84	20	Ludhiana	LDHN	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
85	20	Amritsar	AMRT	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
86	20	Jalandhar	JLND	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
87	21	Jaipur	JPUR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
89	21	Udaipur	UDPR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
90	21	Kota	KOTA	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
91	21	Bikaner	BKNR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
92	22	Gangtok	GNKT	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
93	22	Namchi	NMCH	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
94	23	Chennai	CHEN	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
1	1	Visakhapatnam	VSKP	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
9	2	Naharlagun	NHLG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
18	4	Gaya	GAYA	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
26	5	Korba	KRBA	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
33	7	Vadodara	VDDR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
41	8	Karnal	KRNL	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
49	10	Bokaro	BKRO	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
55	12	Thiruvananthapuram	TVM	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
65	14	Mumbai	MUM	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
73	16	Shillong	SHLG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
81	19	Rourkela	RKLA	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
88	21	Jodhpur	JDPR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
95	23	Coimbatore	CMBT	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
96	23	Madurai	MDRI	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
97	23	Tiruchirappalli	TRCH	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
98	23	Salem	SLM	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
99	24	Hyderabad	HYD	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
100	24	Warangal	WRGL	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
101	24	Nizamabad	NZBD	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
102	24	Karimnagar	KRNG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
103	25	Agartala	AGRT	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
104	25	Udaipur	UDPR_TR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
105	26	Lucknow	LKO	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
106	26	Kanpur	KNPR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
107	26	Noida	NOID	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
108	26	Ghaziabad	GHZB	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
109	26	Agra	AGRA	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
110	26	Varanasi	VRNS	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
111	26	Prayagraj	PRYG	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
112	27	Dehradun	DDUN	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
113	27	Haridwar	HRDW	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
114	27	Nainital	NNTL	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
115	27	Roorkee	RRKE	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
116	28	Kolkata	KLKT	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
117	28	Howrah	HWRH	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
118	28	Siliguri	SLGR	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
119	28	Durgapur	DRGP	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
120	28	Asansol	ASNL	f	t	1	1	2025-12-18 23:45:27.737314	2025-12-18 23:45:27.737314
\.


--
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.country (id, name, code, phone_code, is_deleted, is_active, created_by, updated_by, created_date, updated_date) FROM stdin;
1	India	IN	+91	f	t	1	1	2025-12-18 23:15:45.216221	2025-12-18 23:15:45.216221
\.


--
-- Data for Name: event_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event_categories (id, event_id, category_name, parent_category_id, sort_order, is_active, created_at, updated_at) FROM stdin;
1	1	Music	\N	1	t	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535
2	1	Dance	\N	2	t	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535
3	1	Art Form	\N	3	t	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535
4	1	Classical	1	1	t	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535
5	1	Western	1	2	t	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535
6	1	Contemporary	1	3	t	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535
7	1	Solo	\N	4	t	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535
8	1	Group	\N	5	t	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535
9	2	Music	\N	1	t	2026-01-17 21:12:00.895292	2026-01-17 21:12:00.895292
10	2	Dance	\N	2	t	2026-01-17 21:12:00.912556	2026-01-17 21:12:00.912556
11	2	Art Form	\N	3	t	2026-01-17 21:12:00.913376	2026-01-17 21:12:00.913376
12	2	Classical	1	1	t	2026-01-17 21:12:00.914609	2026-01-17 21:12:00.914609
13	2	Contemporary	1	2	t	2026-01-17 21:12:00.919419	2026-01-17 21:12:00.919419
14	2	Solo	\N	3	t	2026-01-17 21:12:00.925754	2026-01-17 21:12:00.925754
15	2	Group	\N	4	t	2026-01-17 21:12:00.928565	2026-01-17 21:12:00.928565
16	2	Western	1	5	t	2026-01-17 21:12:00.929329	2026-01-17 21:12:00.929329
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events (id, state_id, city_id, name, code, description, payment_required, price, currency, registration_till_date, is_active, is_deleted, created_at, updated_at, created_by, updated_by, image_url, type, organizer_id, title, location, venue, start_date, end_date, total_seats, available_seats, category, is_featured) FROM stdin;
3	14	66	Little Stars	PUNMAH	Little Stars is Nakshatra's free talent hunt. Singers, dancers, and performing artists can audition solo, as a duel, or in a group across classical and contemporary styles.	f	0.00	INR	2026-11-15 00:00:00	t	f	2026-01-29 00:53:03.638785	2026-01-29 00:53:03.638785	1	1	https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80	littlestars	\N	Little Stars	Pan India	\N	2026-11-20 00:00:00	2026-11-22 00:00:00	0	0	\N	f
2	14	66	Test Event	PUNMAH	Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident nulla labore quae dolores aperiam est eaque explicabo debitis officiis, culpa voluptatibus ratione, adipisci dolor error laborum, necessitatibus beatae quos minima.	t	100.00	INR	2026-02-26 00:00:00	t	f	2026-01-17 20:38:15.410462	2026-01-17 20:38:15.410462	1	1	https://www.shutterstock.com/shutterstock/photos/2479223695/display_1500/stock-photo-tallinn-estonia-may-moving-lego-robot-built-by-kids-at-first-lego-league-children-2479223695.jpg	intercollege	\N	Test Event	\N	\N	2026-02-26 00:00:00	2026-02-27 00:00:00	0	0	\N	f
1	14	66	The Star Of India	PUNMAH	The Star of India is Nakshatra's intercollege showcase for music, dance, and performing arts. Registration is free. Solo, duel, and group performances are welcome.	f	0.00	INR	2027-01-10 00:00:00	t	f	2025-12-28 06:58:55.496054	2025-12-28 06:58:55.496054	1	1	https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=1200&q=80	intercollege	\N	The Star Of India	Pan India	\N	2027-01-20 00:00:00	2027-01-22 00:00:00	0	0	\N	f
7	\N	\N	Stage Check	STAGECHECK	Updated temporary event	f	0.00	INR	2026-11-20 00:00:00	f	t	2026-10-26 00:09:24.813157	2026-10-26 01:30:05.53705	admin@nakshatra.local	admin@nakshatra.local	https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80	intercollege	\N	\N	Pune	\N	2026-12-01 00:00:00	2026-12-03 00:00:00	0	0	\N	f
8	\N	\N	Paid	PAID	Paid	t	100.00	INR	2026-10-29 00:00:00	t	f	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	admin@nakshatra.local	admin@nakshatra.local	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0alz_4QfS7tx0wsk8YEeV9r2G4XYdX-ys1p4z7IXC4A&s=10	littlestars	\N	\N	Pune	NA	2026-10-29 00:00:00	2026-10-31 00:00:00	0	0	\N	f
\.


--
-- Data for Name: registration_form_fields; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.registration_form_fields (id, form_id, field_key, label, input_type, is_required, sort_order, options, created_at, updated_at, is_deleted) FROM stdin;
1	1	full_name	Full Name (as per ID proof)	text	t	1	\N	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
2	1	date_of_birth	Date of Birth	date	t	2	\N	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
4	1	gender	Gender	dropdown	t	4	{"options": [{"label": "Male", "value": "M"}, {"label": "Female", "value": "F"}, {"label": "Other", "value": "O"}]}	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
7	1	mobile	Mobile Number (WhatsApp preferred)	tel	t	7	{"pattern": "^[0-9]{10}$", "maxLength": 10}	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
8	1	email	Email Address	email	t	8	\N	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
9	1	instagram_link	Instagram Link	url	f	9	\N	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
13	1	performer_category	Performer Category	radio	t	13	{"options": [{"label": "SINGLE/SOLO", "value": "solo"}, {"label": "DUEL", "value": "duel"}, {"label": "GROUP", "value": "group"}]}	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
14	1	performing_arts_specify	If Performing Arts, please specify (Magic / Mime / Circus arts / Stand-up Comedy / Theatre / Others)	text	f	14	{"dependsOn": {"field": "main_category", "value": "art_form"}}	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
66	4	accepted_terms	I accept the Terms & Conditions and agree that Nakshatra may store these details for this registration.	checkbox	t	99	\N	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
67	5	full_name	Full Name (as per ID proof)	text	t	1	\N	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
68	5	date_of_birth	Date of Birth	date	t	2	\N	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
69	5	gender	Gender	dropdown	t	4	{"options": [{"label": "Male", "value": "M"}, {"label": "Female", "value": "F"}, {"label": "Other", "value": "O"}]}	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
70	5	mobile	Mobile Number (WhatsApp preferred)	tel	t	7	{"pattern": "^[0-9]{10}$", "maxLength": 10}	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
71	5	email	Email Address	email	t	8	\N	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
72	5	instagram_link	Instagram Link	url	f	9	\N	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
3	1	age	Age	number	t	3	{"max": 2, "min": 1}	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
73	5	performer_category	Performer Category	radio	t	13	{"options": [{"label": "SINGLE/SOLO", "value": "solo"}, {"label": "DUEL", "value": "duel"}, {"label": "GROUP", "value": "group"}]}	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
10	1	main_category	Select Your Category (Choose one)	radio	t	10	{"options": [{"label": "Music", "value": "music"}, {"label": "Dance", "value": "dance"}, {"label": "Art Form (Performing Arts)", "value": "art_form"}, {"label": "Other", "value": "other"}]}	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
11	1	other_category	If other, please specify	text	f	11	{"dependsOn": {"field": "main_category", "value": "other"}}	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
74	5	performing_arts_specify	If Performing Arts, please specify (Magic / Mime / Circus arts / Stand-up Comedy / Theatre / Others)	text	f	14	{"dependsOn": {"field": "main_category", "value": "art_form"}}	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
5	1	city_id	City / District	dropdown	t	5	{"dataSource": "cities"}	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	t
6	1	state_id	State	dropdown	t	6	{"dataSource": "states"}	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	t
12	1	sub_category	Category of Music/Dance	checkbox	t	12	{"options": [{"label": "Classical", "value": "classical"}, {"label": "Western", "value": "western"}, {"label": "Contemporary (Modern/Original)", "value": "contemporary"}, {"label": "None", "value": "none"}], "dependsOn": {"field": "main_category", "values": ["music", "dance"]}}	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
15	1	audition_video	Upload Your Audition Video	file	t	15	{"accept": "video/*", "maxSize": 500}	2025-12-30 21:35:52.55535	2025-12-30 21:35:52.55535	f
16	2	full_name	Full Name (as per ID proof)	text	t	1	\N	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
17	2	date_of_birth	Date of Birth	date	t	2	\N	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
18	2	age	Age	number	t	3	{"max": 2, "min": 1}	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
19	2	gender	Gender	dropdown	t	4	{"options": [{"label": "Male", "value": "M"}, {"label": "Female", "value": "F"}, {"label": "Other", "value": "O"}]}	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
20	2	city_id	City / District	dropdown	t	5	{"dataSource": "cities"}	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	t
21	2	state_id	State	dropdown	t	6	{"dataSource": "states"}	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	t
22	2	mobile	Mobile Number (WhatsApp preferred)	tel	t	7	{"pattern": "^[0-9]{10}$", "maxLength": 10}	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
23	2	email	Email Address	email	t	8	\N	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
24	2	instagram_link	Instagram Link	url	f	9	\N	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
25	2	main_category	Select Your Category (Choose one)	radio	t	10	{"options": [{"label": "Music", "value": "music"}, {"label": "Dance", "value": "dance"}, {"label": "Art Form (Performing Arts)", "value": "art_form"}, {"label": "Other", "value": "other"}]}	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
26	2	other_category	If other, please specify	text	f	11	{"dependsOn": {"field": "main_category", "value": "other"}}	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
75	5	age	Age	number	t	3	{"max": 2, "min": 1}	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
76	5	main_category	Select Your Category (Choose one)	radio	t	10	{"options": [{"label": "Music", "value": "music"}, {"label": "Dance", "value": "dance"}, {"label": "Art Form (Performing Arts)", "value": "art_form"}, {"label": "Other", "value": "other"}]}	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
77	5	other_category	If other, please specify	text	f	11	{"dependsOn": {"field": "main_category", "value": "other"}}	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
78	5	sub_category	Category of Music/Dance	checkbox	t	12	{"options": [{"label": "Classical", "value": "classical"}, {"label": "Western", "value": "western"}, {"label": "Contemporary (Modern/Original)", "value": "contemporary"}, {"label": "None", "value": "none"}], "dependsOn": {"field": "main_category", "values": ["music", "dance"]}}	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
79	5	audition_video	Upload Your Audition Video	file	t	15	{"accept": "video/*", "maxSize": 500}	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
80	5	hometown	Hometown	text	t	7	\N	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
27	2	sub_category	Category of Music/Dance	checkbox	t	12	{"options": [{"label": "Classical", "value": "classical"}, {"label": "Western", "value": "western"}, {"label": "Contemporary (Modern/Original)", "value": "contemporary"}, {"label": "None", "value": "none"}], "dependsOn": {"field": "main_category", "values": ["music", "dance"]}}	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
28	2	performer_category	Performer Category	radio	t	13	{"options": [{"label": "SINGLE/SOLO", "value": "solo"}, {"label": "DUEL", "value": "duel"}, {"label": "GROUP", "value": "group"}]}	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
29	2	performing_arts_specify	If Performing Arts, please specify (Magic / Mime / Circus arts / Stand-up Comedy / Theatre / Others)	text	f	14	{"dependsOn": {"field": "main_category", "value": "art_form"}}	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
30	2	audition_video	Upload Your Audition Video	file	t	15	{"accept": "video/*", "maxSize": 500}	2025-12-30 21:35:52.555	2025-12-30 21:35:52.555	f
31	3	full_name	Full Name (as per ID proof)	text	t	1	\N	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
32	3	date_of_birth	Date of Birth	date	t	2	\N	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
33	3	gender	Gender	dropdown	t	4	{"options": [{"label": "Male", "value": "M"}, {"label": "Female", "value": "F"}, {"label": "Other", "value": "O"}]}	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
34	3	mobile	Mobile Number (WhatsApp preferred)	tel	t	7	{"pattern": "^[0-9]{10}$", "maxLength": 10}	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
35	3	email	Email Address	email	t	8	\N	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
36	3	instagram_link	Instagram Link	url	f	9	\N	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
37	3	performer_category	Performer Category	radio	t	13	{"options": [{"label": "SINGLE/SOLO", "value": "solo"}, {"label": "DUEL", "value": "duel"}, {"label": "GROUP", "value": "group"}]}	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
38	3	performing_arts_specify	If Performing Arts, please specify (Magic / Mime / Circus arts / Stand-up Comedy / Theatre / Others)	text	f	14	{"dependsOn": {"field": "main_category", "value": "art_form"}}	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
39	3	age	Age	number	t	3	{"max": 2, "min": 1}	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
40	3	main_category	Select Your Category (Choose one)	radio	t	10	{"options": [{"label": "Music", "value": "music"}, {"label": "Dance", "value": "dance"}, {"label": "Art Form (Performing Arts)", "value": "art_form"}, {"label": "Other", "value": "other"}]}	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
41	3	other_category	If other, please specify	text	f	11	{"dependsOn": {"field": "main_category", "value": "other"}}	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
42	3	city_id	City / District	dropdown	t	5	{"dataSource": "cities"}	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
43	3	state_id	State	dropdown	t	6	{"dataSource": "states"}	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
44	3	sub_category	Category of Music/Dance	checkbox	t	12	{"options": [{"label": "Classical", "value": "classical"}, {"label": "Western", "value": "western"}, {"label": "Contemporary (Modern/Original)", "value": "contemporary"}, {"label": "None", "value": "none"}], "dependsOn": {"field": "main_category", "values": ["music", "dance"]}}	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
45	3	audition_video	Upload Your Audition Video	file	t	15	{"accept": "video/*", "maxSize": 500}	2026-10-25 16:29:16.260017	2026-10-25 16:29:16.260017	f
46	1	hometown	Hometown	text	t	7	\N	2026-10-25 16:29:16.309063	2026-10-25 16:29:16.309063	f
47	2	hometown	Hometown	text	t	7	\N	2026-10-25 16:29:16.309063	2026-10-25 16:29:16.309063	f
48	3	hometown	Hometown	text	t	7	\N	2026-10-25 16:29:16.309063	2026-10-25 16:29:16.309063	f
49	1	accepted_terms	I accept the Terms & Conditions and agree that Nakshatra may store these details for this registration.	checkbox	t	99	\N	2026-10-25 16:29:16.310977	2026-10-25 16:29:16.310977	f
50	2	accepted_terms	I accept the Terms & Conditions and agree that Nakshatra may store these details for this registration.	checkbox	t	99	\N	2026-10-25 16:29:16.310977	2026-10-25 16:29:16.310977	f
51	3	accepted_terms	I accept the Terms & Conditions and agree that Nakshatra may store these details for this registration.	checkbox	t	99	\N	2026-10-25 16:29:16.310977	2026-10-25 16:29:16.310977	f
52	4	full_name	Full Name (as per ID proof)	text	t	1	\N	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
53	4	date_of_birth	Date of Birth	date	t	2	\N	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
54	4	gender	Gender	dropdown	t	4	{"options": [{"label": "Male", "value": "M"}, {"label": "Female", "value": "F"}, {"label": "Other", "value": "O"}]}	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
55	4	mobile	Mobile Number (WhatsApp preferred)	tel	t	7	{"pattern": "^[0-9]{10}$", "maxLength": 10}	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
56	4	email	Email Address	email	t	8	\N	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
57	4	instagram_link	Instagram Link	url	f	9	\N	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
58	4	performer_category	Performer Category	radio	t	13	{"options": [{"label": "SINGLE/SOLO", "value": "solo"}, {"label": "DUEL", "value": "duel"}, {"label": "GROUP", "value": "group"}]}	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
59	4	performing_arts_specify	If Performing Arts, please specify (Magic / Mime / Circus arts / Stand-up Comedy / Theatre / Others)	text	f	14	{"dependsOn": {"field": "main_category", "value": "art_form"}}	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
60	4	age	Age	number	t	3	{"max": 2, "min": 1}	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
61	4	main_category	Select Your Category (Choose one)	radio	t	10	{"options": [{"label": "Music", "value": "music"}, {"label": "Dance", "value": "dance"}, {"label": "Art Form (Performing Arts)", "value": "art_form"}, {"label": "Other", "value": "other"}]}	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
62	4	other_category	If other, please specify	text	f	11	{"dependsOn": {"field": "main_category", "value": "other"}}	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
63	4	sub_category	Category of Music/Dance	checkbox	t	12	{"options": [{"label": "Classical", "value": "classical"}, {"label": "Western", "value": "western"}, {"label": "Contemporary (Modern/Original)", "value": "contemporary"}, {"label": "None", "value": "none"}], "dependsOn": {"field": "main_category", "values": ["music", "dance"]}}	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
64	4	audition_video	Upload Your Audition Video	file	t	15	{"accept": "video/*", "maxSize": 500}	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
65	4	hometown	Hometown	text	t	7	\N	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	f
81	5	accepted_terms	I accept the Terms & Conditions and agree that Nakshatra may store these details for this registration.	checkbox	t	99	\N	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	f
\.


--
-- Data for Name: registration_forms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.registration_forms (id, state_id, event_id, name, is_default, is_active, is_deleted, created_at, updated_at, created_by, updated_by, version, is_template) FROM stdin;
1	\N	1	Talent Hunt Registration Form	t	t	f	2025-12-30 21:34:23.55636	2025-12-30 21:34:23.55636	\N	\N	1	f
2	\N	2	Test Event	t	t	f	2026-01-17 20:39:01.101217	2026-01-17 20:39:01.101217	\N	\N	1	f
3	\N	3	Little Stars Registration Form	t	t	f	2026-10-25 16:29:16.23536	2026-10-25 16:29:16.23536	\N	\N	1	f
4	\N	7	Stage Check Registration Form	t	t	f	2026-10-26 00:09:24.813157	2026-10-26 00:09:24.813157	\N	\N	1	f
5	\N	8	Paid Registration Form	t	t	f	2026-10-26 01:32:18.026745	2026-10-26 01:32:18.026745	\N	\N	1	f
\.


--
-- Data for Name: site_content; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_content (key, value, updated_at) FROM stdin;
hero_title	The Star of India — Where Talent Finds Its Purpose	2026-10-26 00:07:56.943677
hero_subtitle	India's premier platform to discover, recognize, and celebrate talent across music, dance, and performing arts.	2026-10-26 00:07:56.946587
about_copy	Nakshatra, The Star of India, is a national platform for music, dance, and performing arts. Hosted by Entertainment Cube Networks, it gives solo, duel, and group performers a place to be seen, mentored, and celebrated. Auditions cover classical and contemporary music and dance, along with theatre, folk arts, magic, stand-up comedy, storytelling, mimicry, and live painting.	2026-10-26 00:07:56.947095
\.


--
-- Data for Name: state; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.state (id, country_id, name, code, is_deleted, is_active, created_by, updated_by, created_date, updated_date, is_participating) FROM stdin;
3	1	Assam	AS	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
4	1	Bihar	BR	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
5	1	Chhattisgarh	CG	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
6	1	Goa	GA	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
7	1	Gujarat	GJ	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
8	1	Haryana	HR	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
9	1	Himachal Pradesh	HP	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
10	1	Jharkhand	JH	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
13	1	Madhya Pradesh	MP	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
15	1	Manipur	MN	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
16	1	Meghalaya	ML	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
17	1	Mizoram	MZ	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
18	1	Nagaland	NL	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
19	1	Odisha	OD	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
20	1	Punjab	PB	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
21	1	Rajasthan	RJ	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
22	1	Sikkim	SK	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
23	1	Tamil Nadu	TN	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
25	1	Tripura	TR	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
26	1	Uttar Pradesh	UP	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
27	1	Uttarakhand	UK	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
28	1	West Bengal	WB	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	f
11	1	Karnataka	KA	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	t
12	1	Kerala	KL	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	t
14	1	Maharashtra	MH	f	t	1	1	2025-12-18 23:28:12.857444	2025-12-18 23:28:12.857444	t
2	1	Arunachal Pradesh	AR	f	t	1	1	2025-12-18 23:28:12.857444	2026-10-26 01:30:02.957437	f
24	1	Telangana	TS	f	t	1	1	2025-12-18 23:28:12.857444	2026-10-26 01:29:56.311042	t
1	1	Andhra Pradesh	AP	f	t	1	1	2025-12-18 23:28:12.857444	2026-10-26 01:30:05.690695	t
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, true);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookings_id_seq', 1, false);


--
-- Name: city_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.city_id_seq', 120, true);


--
-- Name: country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.country_id_seq', 1, true);


--
-- Name: event_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.event_categories_id_seq', 16, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.events_id_seq', 8, true);


--
-- Name: gallery_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gallery_images_id_seq', 1, false);


--
-- Name: inquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inquiries_id_seq', 2, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: registration_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.registration_answers_id_seq', 78, true);


--
-- Name: registration_form_fields_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.registration_form_fields_id_seq', 81, true);


--
-- Name: registration_forms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.registration_forms_id_seq', 5, true);


--
-- Name: registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.registrations_id_seq', 8, true);


--
-- Name: state_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.state_id_seq', 28, true);


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tickets_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: city city_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.city
    ADD CONSTRAINT city_pkey PRIMARY KEY (id);


--
-- Name: country country_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_pkey PRIMARY KEY (id);


--
-- Name: event_categories event_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT event_categories_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: gallery_images gallery_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_images
    ADD CONSTRAINT gallery_images_pkey PRIMARY KEY (id);


--
-- Name: inquiries inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT inquiries_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: registration_answers registration_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registration_answers
    ADD CONSTRAINT registration_answers_pkey PRIMARY KEY (id);


--
-- Name: registration_form_fields registration_form_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registration_form_fields
    ADD CONSTRAINT registration_form_fields_pkey PRIMARY KEY (id);


--
-- Name: registration_forms registration_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registration_forms
    ADD CONSTRAINT registration_forms_pkey PRIMARY KEY (id);


--
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- Name: site_content site_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_content
    ADD CONSTRAINT site_content_pkey PRIMARY KEY (key);


--
-- Name: state state_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.state
    ADD CONSTRAINT state_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_ticket_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key UNIQUE (ticket_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_bookings_event; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_event ON public.bookings USING btree (event_id);


--
-- Name: idx_bookings_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_status ON public.bookings USING btree (status);


--
-- Name: idx_bookings_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_user ON public.bookings USING btree (user_id);


--
-- Name: idx_events_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_active ON public.events USING btree (is_active);


--
-- Name: idx_payments_booking; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payments_booking ON public.payments USING btree (booking_id);


--
-- Name: idx_tickets_booking; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tickets_booking ON public.tickets USING btree (booking_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: bookings bookings_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: event_categories event_categories_event_id_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT event_categories_event_id_events_id_fk FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: event_categories event_categories_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT event_categories_parent_id_fk FOREIGN KEY (parent_category_id) REFERENCES public.event_categories(id);


--
-- Name: events events_organizer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.users(id);


--
-- Name: events events_state_id_state_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_state_id_state_id_fk FOREIGN KEY (state_id) REFERENCES public.state(id);


--
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: registration_answers registration_answers_field_id_registration_form_fields_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registration_answers
    ADD CONSTRAINT registration_answers_field_id_registration_form_fields_id_fk FOREIGN KEY (field_id) REFERENCES public.registration_form_fields(id) ON DELETE CASCADE;


--
-- Name: registration_form_fields registration_form_fields_form_id_registration_forms_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registration_form_fields
    ADD CONSTRAINT registration_form_fields_form_id_registration_forms_id_fk FOREIGN KEY (form_id) REFERENCES public.registration_forms(id) ON DELETE CASCADE;


--
-- Name: registration_forms registration_forms_state_id_state_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registration_forms
    ADD CONSTRAINT registration_forms_state_id_state_id_fk FOREIGN KEY (state_id) REFERENCES public.state(id);


--
-- Name: registrations registrations_event_id_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_event_id_events_id_fk FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE RESTRICT;


--
-- Name: registrations registrations_form_id_registration_forms_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_form_id_registration_forms_id_fk FOREIGN KEY (form_id) REFERENCES public.registration_forms(id) ON DELETE SET NULL;


--
-- Name: registrations registrations_state_id_state_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_state_id_state_id_fk FOREIGN KEY (state_id) REFERENCES public.state(id) ON DELETE SET NULL;


--
-- Name: registrations registrations_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: tickets tickets_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- PostgreSQL database dump complete
--

\unrestrict mgAmW1pi10x2bwexlSSHSfNH3ztGSaDmX13ReyJhyeG8BviU0xd9XW3mAf21VJn

