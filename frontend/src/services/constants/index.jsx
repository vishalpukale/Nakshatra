/* eslint-disable react-refresh/only-export-components */
// Enums
import TruncatedTooltip from "../../ui-controls/truncated-tooltip";
import TruncatedTooltipCell from "../../ui-controls/new-tooltip";
import toggle from "daisyui/components/toggle";
// import { getStatusChip } from "../utils";

const viewEnum = {
  tile: "TILE",
  list: "LIST",
};

const SIDEBAR_STATES = {
  EXPANDED: "expanded",
  COLLAPSED: "collapsed",
};

const TOKEN_KEY = "token";
const sizeEnum = {
  doubleExtraSmall: "xxs",
  extraSmall: "xs",
  small: "sm",
  medium: "md",
  large: "lg",
  extraLarge: "xl",
};

const positionEnum = {
  left: "left",
  right: "right",
};

const exportFormatEnum = {
  csv: "CSV",
  excel: "EXCEL",
};

const exportEnum = {
  idle: "IDLE",
  loading: "LOADING",
  succeeded: "SUCCEEDED",
};

const datePickerEnum = {
  startDate: "START_DATE",
  endDate: "END_DATE",
};

const sortingEnum = {
  ascending: "ASC",
  descending: "DESC",
};

const inputTypeEnum = {
  password: "password",
  text: "text",
};

const timePeriodEnum = {
  sameDay: "SAME_DAY",
  days90: "NINETY_DAYS",
  months12: "TWELVE_MONTHS",
  months24: "TWENTY_FOUR_MONTHS",
};

// icon

const chevIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      fillRule="evenodd"
      d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const chevRight = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      fillRule="evenodd"
      d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
      clipRule="evenodd"
    />
  </svg>
);
const USER_STATUS = {
  NEW: "new",
  ONBOARDING: "onboarding",
  ACTIVE: "active",
  INACTIVE: "inactive",
  AGENT: "agent",
  ADMIN: "admin",
  LICENSE_UNDER_REVIEW: "AGT_STG6",
  REJECT: "AGT_STG5",
  APPROVED: "AGT_STG4",

  SIGN_IN: "AGT_STG1",
  ONBOARDING_AGT: "AGT_STG2",
  UNDER_REVIEW: "AGT_STG3",
  LICENSE_VERIFIED: "AGT_STG9",
  LICENSE_REJECTED: "AGT_STG7",
  EMAIL_VERIFIED: "AGT_STG6",
  TERMINATED: "AGT_STG12",
};

const USER_STATUS_FOR_HEADER = {
  AGT_STG1: "Signup",
  AGT_STG2: "Onboarding",
  AGT_STG3: "Pend. EMD Approval",
  AGT_STG4: "Onboarded",
  AGT_STG5: "Onboarding Rejected",
  AGT_STG6: "Checking Res. License",
  AGT_STG7: "Res. License Rejected",
  AGT_STG8: "Contract Request Received",
  AGT_STG9: "Active",
  AGT_STG12: "Terminated",
};
const ROLE = [
  {
    id: 1,
    name: "Individual",
  },
  {
    id: 2,
    name: "Non-Individual",
  },
];

const ADMIN_FILTER_STATUS = [
  {
    id: 1,
    label: "Active",
    name: "ACT",
  },
  {
    id: 2,
    label: "Expired",
    name: "EXP",
  },
  {
    id: 3,
    label: "Expiring in 60 days",
    name: "EXPS",
  },
];

const COURSE_STATUSES = {
  COMPLETED: "CMP",
  INPROGRESS: "INP",
  ENROLL: "ENR",
  UNENROLL: "UNR",
};

const RESIDENTIAL_STATUS = [
  { name: "Yes", code: 1, slug: "yes" },
  { name: "No", code: 0, slug: "no" },
];
const MARITAL_STATUS = [
  { value: "S", label: "Single" },
  { value: "M", label: "Married" },
  { value: "D", label: "Divorced" },
  { value: "W", label: "Widowed" },
  // { value: "P", label: "Separated" },
  // { value: "U", label: "Unmarried" },
  // { value: "X", label: "Unknown" },
];

const MARITAL_SYMBOLS = {
  SINGLE: "S",
  MARRIED: "M",
  DIVORCED: "D",
  WIDOWED: "W",
};

const countryOptions = [
  { name: "🇺🇸 +1", dialCode: "+1", countryCode: "US" },
  // { name: "🇮🇳 +91", dialCode: "+91" },
  // { name: "🇬🇧 +44", dialCode: "+44" },
  { name: "🇨🇦 +1", dialCode: "+1", countryCode: "CA" },
];

const gridFormatEnum = {
  amount: "AMOUNT",
  amountWithCurrency: "AMOUNT_CURR",
  date: "DATE",
};
const dialogEnum = {
  approverAction: {
    override: "OVERRIDE_ACTION",
  },
};

const UNAUTHENTICATED_ROUTES = ["/sign-in", "/unuthorized"];

const SUFFIX_OPTIONS = [
  { name: "Sr", key: "Sr" },
  { name: "Jr", key: "Jr" },
  { name: "I", key: "I" },
  { name: "II", key: "II" },
  { name: "III", key: "III" },
  { name: "IV", key: "IV" },
  { name: "V", key: "V" },
  { name: "VI", key: "VI" },
];

const GENDER_OPTIONS = [
  { name: "Male", key: "M" },
  { name: "Female", key: "F" },
  { name: "Other", key: "O" },
];
const TITLE_OPTIONS = [
  { name: "Mr.", key: "Mr" },
  { name: "Ms.", key: "Ms" },
  { name: "Mrs.", key: "Mrs" },
  { name: "Miss", key: "Miss" },
  { name: "Dr.", key: "Dr" },
];

const desktopTabs = [
  { code: "LIC", displayName: "Licenses" },
  { code: "COMP", displayName: "Compliance" },
  { code: "CAPP", displayName: "Carrier Appointments" },
  { code: "DOCS", displayName: "Documents" },
  { code: "ALOG", displayName: "Activity Logs" },
];

const mobileTabs = [
  { code: "LIC", displayName: "Licenses" },
  { code: "PROF", displayName: "Profile" },
  { code: "COMP", displayName: "Compliance" },
  { code: "CAPP", displayName: "Carrier Appointments" },
  { code: "DOCS", displayName: "Documents" },
  { code: "ALOG", displayName: "Activity Logs" },
];

const ADVERTISE_SCREEN = [
  { name: "Login Screen", value: "login", dimension: "360x640" },
  { name: "Agent Landing Screen", value: "landing", dimension: "980x340" },
  { name: "Agent Dashboard", value: "agentDashboard", dimension: "680x360" },
];

const STATUS = [
  { name: "Active", value: true },
  { name: "Deactive", value: false },
];

const MARITAL_STATUS_MAP = {
  S: "Single",
  M: "Married",
  D: "Divorced",
  W: "Widowed",
  P: "Separated",
  U: "Unmarried",
  X: "Unknown",
};
const accountTypes = [
  { name: "Checking", key: 0 },
  { name: "Savings", key: 1 },
];
const GENDER_MAP = {
  M: "Male",
  F: "Female",
  O: "Other",
};

const ONBOARDING_NON_APPROVED = [
  "AGT_STG1",
  "AGT_STG2",
  "AGT_STG3",
  "AGT_STG5",
];

const ADMIN_APPROVED_STATUSES = ["AGT_STG4", "AGT_STG9"];

const AGENT_DATA_STATUS = {
  ACT: "Active",
  EXP: "Expired",
  EXPS: "Expiring in 60 days",
};
const AGENT_TYPES = [
  { name: "Personal", key: "personal" },
  { name: "Base", key: "base" },
  { name: "Super Base", key: "super_base" },
  { name: "Super Team", key: "super_team" },
];

const AGENT_GENERATIONS_TYPES = [
  { name: "All", key: "all" },
  { name: "Personal", key: "personal" },
  { name: "Base", key: "base" },
  { name: "Super Base", key: "super_base" },
  { name: "Super Team", key: "super_team" },
];

const CLIENT_MANAGEMENT_COLUMNS = [
  {
    field: "writingAgentName",
    header: "AGENT NAME",
    fieldStyle: "max-w-0",
    render: (value, row) => (
      <div className="min-w-0 flex-1">
        <TruncatedTooltip
          text={value}
          className="hover:text-primary-accent cursor-pointer transition-colors duration-200 hover:underline"
        // className="cursor-pointer"
        // subLabel={row.writingAgentNpn}
        // showSubLabel={!!row.writingAgentNpn}
        />
      </div>
    ),
  },
  { field: "writingAgentCode", header: "AGENT CODE" },
  {
    field: "policyNumber",
    header: "POLICY NUMBER",
    clickable: true,
    isHoverEnabled: true,
    render: (value, row) => (
      <div className="min-w-0 flex-1">
        <TruncatedTooltip
          text={value}
          // className="cursor-pointer"
          className="hover:text-primary-accent cursor-pointer transition-colors duration-200 hover:underline"
        />
      </div>
    ),
  },
  {
    field: "carrier",
    header: "CARRIER",
    fieldStyle: "min-w-30 max-w-0",
    render: (value, row) => (
      <div className="min-w-0 flex-1">
        <TruncatedTooltip text={value} className="cursor-pointer" />
      </div>
    ),
  },
  {
    field: "productType",
    header: "PRODUCT",
    fieldStyle: "min-w-50 max-w-0",
    render: (value, row) => (
      <div className="min-w-0 flex-1">
        <TruncatedTooltip text={value} className="cursor-pointer" />
      </div>
    ),
  },
  {
    field: "policyStatus",
    header: "STATUS",
    render: (value, row) => (
      <div className="min-w-0 flex-1">
        <TruncatedTooltip text={value} className="cursor-pointer" />
      </div>
    ),
  },
  // { field: "state", header: "STATE" },
  { field: "faceAmount", header: "FACE" },
  { field: "submitDate", header: "SUBMIT DATE" },
  { field: "issueDate", header: "ISSUE DATE" },
  { field: "anniversaryDate", header: "ANNIVERSARY DATE" },
  { field: "policyEffectiveDate", header: "EFFECTIVE DATE" },
  { field: "premiumAmount", header: "PREMIUM" },
  { field: "split", header: "SPLIT" },

  // {
  //   field: "insurer",
  //   header: "INSURER",
  //   fieldStyle: "max-w-0",
  //   render: (value, row) => (
  //     <div className="min-w-0 flex-1">
  //       <TruncatedTooltip text={value} className="cursor-pointer" />
  //     </div>
  //   ),
  // },
];

const CLIENT_DATE_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  {
    id: "this_week",
    label: "This Week",
  },
  { id: "this_month", label: "This Month" },
  { id: "ytd", label: "YTD" },
  {
    id: "custom",
    label: "Custom",
    children: [{ id: "range", label: "Select Range" }],
  },
];

const CLIENT_MANAGEMENT_HEADERS = [
  "Agent Name",
  "Agent Code",
  "Policy Number",
  "Carrier",
  "Product",
  "Status",
  "Face",
  "Submit Date",
  "Issue Date",
  "Anniversary Date",
  "Effective Date",
  "Premium",
  "Split"
];

const CLIENT_POLICY_STATUSES = [
  { label: "Approved", value: "Approved" },
  { label: "Closed", value: "Closed" },
  { label: "Grace", value: "Grace" },
  { label: "Inforce", value: "Inforce" },
  { label: "Issued", value: "Issued" },
  { label: "Lapse", value: "Lapse" },
  { label: "Not Taken", value: "Not Taken" },
  { label: "Pending", value: "Pending" },
  { label: "Other", value: "Other" },
];

const STATUS_COLORS_WITH_LABLE = {
  ACT: {
    label: "Active",
    className:
      "text-dark-green w-min rounded-2xl bg-[#D9FDE5] px-4 text-center",
  },
  active: {
    label: "Active",
    className:
      "text-dark-green w-min rounded-2xl bg-[#D9FDE5] px-4 text-center",
  },
  approved: {
    label: "Approved",
    className:
      "text-dark-green w-min rounded-2xl bg-[#D9FDE5] px-4 text-center",
  },
  pending: {
    label: "Pending",
    className:
      "text-amber-600 w-min items-center rounded-2xl bg-orange-100 px-4 text-center",
  },
  EXP: {
    label: "Expired",
    className: "w-min rounded-2xl bg-[#FDD9D9AB] px-4 text-center text-red-500",
  },
  EXPS: {
    label: "Expiring in 60 days",
    className:
      "grid h-6 w-min items-center rounded-2xl bg-orange-100 px-3 text-center text-sm font-semibold text-amber-600",
  },
  Yes: {
    label: "Yes",
    className: "bg-dark-green w-min rounded-2xl px-2 text-center text-white",
  },
  No: {
    label: "No",
    className: "w-min rounded-2xl bg-red-500 px-2 text-center text-white",
  },
};

const DATE_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "this_week", label: "This Week" },
  { id: "this_month", label: "This Month" },
  { id: "ytd", label: "YTD" },
  {
    id: "custom",
    label: "Custom",
    children: [{ id: "range", label: "Select Range" }],
  },
];

const PAYMENT_MODES = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Semi-Annual", value: "semiannual" },
  { label: "Annual", value: "annual" },
  { label: "Single", value: "single" },
  { label: "Bimonthly", value: "bimonthly" },
  { label: "Weekly", value: "weekly" },
  { label: "Biweekly", value: "biweekly" },
];

const USER_CREATED_THROUGH = {
  SIGNUP: "signup", //Tevah
  API: "api", // GFI SureLC
};

const USER_TYPE = {
  AGENT: "AGT",
  ADMIN: "ADM",
  BACK_OFFICE: "BO",
};
const CARRIER_CONDITIONAL_BUTTONS = {
  ACK: "Visit SureLC",
  AKP: "Acknowledge",
  IRV: "Add Carrier Writing Code",
  ACP: "Add Carrier Writing Code",
};
const CONTRACTING_STATUS = {
  BGA: "ACS", //Allow Carrier Submission
  Discarded: "RJC", //Rejected
  Completed: "ACP", //Approved
  Producer: "ACS", //Created
  Carrier: "IRV", //In Review
  Acknowledged: "ACK", //Acknowledged
  Deactivated: "DAC", //Deactivated
  Active: "ACP", //Acknowledged by Agent
  AcknowledgedPending: "AKP", //Acknowledged Pending,
  Appointed: "APT",
};
const CONTRACTING_STATUS_MAP = {
  ACK: "Acknowledged",
  AKP: "Ack Pending",
  ACS: "Under Review",
  IRV: "At Carrier",
  ACP: "Approved", //At Carrier,
  RJC: "Rejected",
  DAC: "Deactivated",
  APT: "Appointed",
};
const CONTRACTING_STATUS_BUTTON_STYLE = {
  ACS: "bg-orange-100 text-amber-600",
  RJC: "bg-red-600/10 text-red-600",
  ACP: "bg-green-600/10 text-green-600",
  IRV: "bg-green-600/10 text-green-600",
  ACK: "",
  DAC: "bg-red-600/10 text-red-600",
  AKP: "",
  APT: "bg-green-600/10 text-green-600",
};
const CONTRACTING_WRITABLE_CODE_MAP = {
  IRV: "At Carrier",
  ACP: "Approved",
};

const DISPLAY_TYPE = {
  ANCM: { displayName: "Announcement", code: "ANCM" },
  NTFC: { displayName: "Notification", code: "NTFC" },
};

const CONTENT_TYPE = {
  URL: { key: "URL", label: "URL" },
  TEXT: { key: "TEXT", label: "Text Editor" },
};

const ACTION_BUTTON_OPTIONS = [
  // { label: "In Review", name: "IRV" },
  // { label: "Allow Carrier Submission", name: "ACS" },
  { label: "Approved", name: "ACP" },
  { label: "Rejected", name: "RJC" },
];

const MODULE_SCREENS = {
  AGENTS: "ADM-DB",
  LICENSE: "ADM-LIC",
  CARRIER: "ADM-CRR",
  CONTRACT_REQUEST: "ADM-CR",
  CONFIGURATION: "ADM-CF",
};
const MODULE_FIELDS = {
  AGENT_TERMINATION: "ADM-TRM",
  EDIT_AGENT_PROFILE: "ADM-EPR",
};

const ACCESS_TYPES = {
  FIELD: "field",
  SCREEN: "screen",
};

const sureLcStatusOptions = [
  { label: "Acknowledged", name: "ACK" },
  { label: "Ack Pending", name: "AKP" },
  { label: "Under Review", name: "ACS" },
  { label: "At Carrier", name: "IRV" },
  { label: "Approved", name: "ACP" },
  { label: "Rejected", name: "RJC" },
  { label: "Deactivated", name: "DAC" },
  { label: "Appointed", name: "APT" },
];

const ALLOWED_STATUSES_FOR_ALL_PATHS = [
  "AGT_STG4", // Onboarded
  "AGT_STG5",
  "AGT_STG6",
  "AGT_STG7",
  "AGT_STG8",
  "AGT_STG9", // Active
];
const ALLOWED_STATUSES_CONTRACTING = [
  "AGT_STG8",
  "AGT_STG9", // Active
];

const routeAccessRules = {
  "/agent/contracting": ["AGT_STG8", "AGT_STG9"],
  // "/agent/dashboard": [],
  "/agent/dashboard": ["AGT_STG4", "AGT_STG5", "AGT_STG6", "AGT_STG7", "AGT_STG8", "AGT_STG9"],

  "/agent/commissions": [
    "AGT_STG4",
    "AGT_STG5",
    "AGT_STG6",
    "AGT_STG7",
    "AGT_STG8",
    "AGT_STG9",
  ],
  "/agent/compliance": [
    "AGT_STG4",
    "AGT_STG5",
    "AGT_STG6",
    "AGT_STG7",
    "AGT_STG8",
    "AGT_STG9",
  ],
  "/agent/client-management": [
    "AGT_STG4",
    "AGT_STG5",
    "AGT_STG6",
    "AGT_STG7",
    "AGT_STG8",
    "AGT_STG9",
  ],
  "/agent/training": ["AGT_STG9",],
  // "/agent/training": ["AGT_STG8", "AGT_STG9"],

  "/agent/team-reports": [],
  "/agent/onboarding": ["AGT_STG1", "AGT_STG2", "AGT_STG3", "AGT_STG5"],
  // "/agent/team-reports": [
  //   "AGT_STG4",
  //   "AGT_STG5",
  //   "AGT_STG6",
  //   "AGT_STG7",
  //   "AGT_STG8",
  //   "AGT_STG9",
  // ],
};

const CLIENT_MANAGEMENT_PRODUCTS = [
  { label: "Life", value: "Life" },
  { label: "Annuity", value: "Annuity" },
];
const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9-_]+$/;

const allowedRegex = /^[\w\s.,@!$%&*()\-+=:;"'?/\\[\]{}|<>^`~#]+$/u;

const COUNTRY_CODE = {
  CANADA: "CA",
  INDIA: "IND",
  USA: "US",
};

const EXECUTIVE_TABS = [
  { key: "Submitted_Apps", label: "Submitted Apps" },
  { key: "Submitted_Premium", label: "Submitted Premium" },
  { key: "Paid_Apps", label: "Paid Apps" },
  { key: "Paid_Premium", label: "Paid Premium" },
];
const EXECUTIVE_DATE_FILTER = [
  { key: "today", label: "Today" },
  { key: "last7days", label: "Last 7 Days" },
  { key: "last7weeks", label: "Last 7 Weeks" },

  { key: "last12months", label: "Last 12 Months" },
  { key: "yeartodate", label: "YTD" },
];

const LICENSE_STATUS = {
  ACT: "ACT",
  EXP: "EXP",
  EXPS: "EXPS"
};

export {
  LICENSE_STATUS,
  allowedRegex,
  ALPHANUMERIC_REGEX,
  routeAccessRules,
  sureLcStatusOptions,
  viewEnum,
  sizeEnum,
  positionEnum,
  exportFormatEnum,
  sortingEnum,
  datePickerEnum,
  inputTypeEnum,
  timePeriodEnum,
  exportEnum,
  chevIcon,
  chevRight,
  TOKEN_KEY,
  USER_STATUS,
  ROLE,
  MARITAL_STATUS,
  countryOptions,
  gridFormatEnum,
  dialogEnum,
  SIDEBAR_STATES,
  UNAUTHENTICATED_ROUTES,
  TITLE_OPTIONS,
  SUFFIX_OPTIONS,
  GENDER_OPTIONS,
  desktopTabs,
  mobileTabs,
  RESIDENTIAL_STATUS,
  ADVERTISE_SCREEN,
  STATUS,
  MARITAL_STATUS_MAP,
  GENDER_MAP,
  ONBOARDING_NON_APPROVED,
  ADMIN_APPROVED_STATUSES,
  ADMIN_FILTER_STATUS,
  AGENT_DATA_STATUS,
  CLIENT_MANAGEMENT_COLUMNS,
  CLIENT_MANAGEMENT_HEADERS,
  CLIENT_POLICY_STATUSES,
  AGENT_TYPES,
  AGENT_GENERATIONS_TYPES,
  DATE_OPTIONS,
  STATUS_COLORS_WITH_LABLE,
  PAYMENT_MODES,
  USER_CREATED_THROUGH,
  CLIENT_DATE_OPTIONS,
  USER_TYPE,
  CARRIER_CONDITIONAL_BUTTONS,
  CONTRACTING_STATUS,
  accountTypes,
  USER_STATUS_FOR_HEADER,
  CONTRACTING_STATUS_BUTTON_STYLE,
  ACTION_BUTTON_OPTIONS,
  CONTRACTING_WRITABLE_CODE_MAP,
  CONTRACTING_STATUS_MAP,
  MODULE_SCREENS,
  ACCESS_TYPES,
  MODULE_FIELDS,
  COURSE_STATUSES,
  ALLOWED_STATUSES_FOR_ALL_PATHS,
  ALLOWED_STATUSES_CONTRACTING,
  CLIENT_MANAGEMENT_PRODUCTS,
  COUNTRY_CODE,
  MARITAL_SYMBOLS,
  DISPLAY_TYPE, CONTENT_TYPE,
  EXECUTIVE_DATE_FILTER,
  EXECUTIVE_TABS
};
