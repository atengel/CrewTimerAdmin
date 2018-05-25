// Usage:
// import * as Names from './Names';
// console.log("N_UUID="+Names.N_UUID);
//
// or
//import {N_UUID, N_FLIGHT} from './Names';
// console.log("N_UUID="+N_UUID);
//
export const N_REGATTA = "regatta";
export const N_UUID = "uuid";
export const N_ENTRY_ID = "EntryId"; // Flight-EventNum-Bow
export const N_EVENT_ID = "EventId"; // Flight-EventNum
export const N_DAY = "Day";
export const N_EVENT_NAME = "Event";
export const N_EVENT_ABBREV = "EventAbbrev";
export const N_FLIGHT = "Flight";
export const N_EVENTNUM = "EventNum";
export const N_CREW = "Crew";
export const N_CREW_ABBREV = "CrewAbbrev";
export const N_CATEGORY = "Category";
export const N_BOW = "Bow";
export const N_STROKE = "Stroke";
export const N_COX = "Cox";
export const N_START = "Start";
export const N_GATE = "Gate";
export const N_TIME = "Time";  // HH:MM:SS.SSS
export const N_TIMESTAMP = "Timestamp";  // UTC milli
export const N_STATUS = "Status";
export const N_STATE = "State";  // empty or 'Deleted'
export const N_PENALTY_TIME = "PenaltyTime";
export const N_PENALTY_CODES = "PenaltyCode";
export const N_ADJUST_TIME = "AdjustTime";
export const N_HANDICAP = "Handicap";
export const N_HANDICAP_CODE = "HandicapCode";
export const N_ADJUST_TIMEx = "AdjustTime";
export const N_EXHIBITION = "Exhibition";
export const N_WAYPOINTS = "Waypoints";
export const N_RESULT_WAYPOINTS = "ResultWaypoints";
export const N_DAY_LIST = "DayList";

export const STATE_DELETED = "Deleted";

// synthetic derived fields
export const N_RAW_TIME = "RawTime";
export const N_ADJ_TIME = "AdjTime";
export const N_REF_ACTION = "PenaltyCode";
export const N_PENALTY = "Penalty";
export const N_PLACE = "Place";
export const N_PENALTY_TIME_MS = "PenaltyTimeMs";
export const N_FINAL_TIME_MS = "FinalTimeMs";

export const N_ADJUST_TIME_MS = "AdjustTimeMs";
export const N_EVENT_KEY = "eventKey";
export const N_AGE = "Age";
export const N_OFFICIAL = "Official";
export const N_OFFICIAL_TIME_MS = "OfficialTimeMs";
export const N_TWEET = "tweet";
export const N_START_TIME = "S_time";
export const N_FINISH_TIME = "F_time";

// Special N_GATE values
export const N_GATE_PEN = "Pen";
export const N_GATE_ADJ = "Adj";
export const N_GATE_REFEREE = "R";
export const N_GATE_FINISH = "F";
export const N_GATE_START = "S";

// Special N_REF_ACTION values
export const N_REF_ACTION_OFFICIAL = "Official";
export const N_REF_ACTION_FALSE_START = "FalseStart";

// Column titles
export const N_ADJUST_TITLE = "Adjust";
export const N_BOW_TITLE = "Bow";
export const N_STROKE_COX = "Stroke / Cox";
export const N_ADJ_TIME_TITLE = "Time";
export const N_LANE_TITLE = "Lane";

// Regatta Info fields
export const N_NAME = "Name";
export const N_TITLE = "Title";
export const N_DATE = "Date";
export const N_MOBILE_PIN = "MobileKey";
export const N_DOC_URL = "DocUrl";
export const N_INFO_TEXT = "InfoText";
export const N_PENALTY_CODES_TITLE = "Code";
export const N_FINISHED = "Finished";
export const N_OWNER = "Owner";
export const N_UID = "uid";
export const N_ADMINS = "Admins";
export const N_PUBLIC = "Public";
export const N_ENTRIES = "entries";	// List<ArgMap>
export const N_CSV_TIMESTAMP = "CsvTimestamp";
export const N_ENTRY_CSV = "entryCsv";
export const N_RACE_TYPE = "RaceType";
export const N_RACE_TYPE_SPRINT = "Sprint";
export const N_RACE_TYPE_HEAD = "Head";
export const N_HANDICAP_TYPE = "HandicapType";
export const N_HANDICAP_MULTIPLIER = "HandicapMultiplier";
export const N_CUSTOM_CODES = "CustomCodes";
export const N_CLEAR_TS = "ClearTS";

// Twitter
export const N_TWITTER_TWEET_RESULTS = "TweetResults";
export const N_TWITTER_AUTH_URL = "TwitterAuthURL";
export const N_TWITTER_SCREEN_NAME = "TwitterScreenName";
export const N_TWITTER_STATUS = "TwitterStatus";
export const N_TWITTER_REQUEST_TOKEN = "TwitterRequestToken";
export const N_TWITTER_ACCESS_TOKEN = "TwitterAccessToken";
export const N_TWITTER_ACCESS_TOKEN_SECRET = "TwitterAccessTokenSecret";

// Regatta Handicap Types
export const N_HANDICAP_NONE = "None";
export const N_HANDICAP_MANUAL = "Manual";
export const N_HANDICAP_US = "US";
export const N_HANDICAP_RA = "RA";

// Regatta Results ArgMap keys
export const N_EVENT_KEY_TO_NAME = "eventKeyToName";
export const N_EVENT_LISTS = "eventLists";
export const N_EVENT_INFO = "eventInfo";
export const N_EVENT_ITEMS = "eventItems";  // List<ArgMap> containing ordered list of entries
export const N_EVENT_INDEX = "eventIndex";  // ordinal index for this event in eventItems
export const N_LAST_UPDATED_EVENT = "lastUpdatedEvent";

// stored preferences
export const N_NAME_LIST = "NameList";
export const N_REGATTA_LIST_NAME = "RegattaList";
export const N_CLICKER_ID = "ClickerId";
export const N_CLICKER_AUTH = "ClickerAuth";
export const N_HORN_ID = "HornId";
export const N_HORN_AUTH = "HornAuth";
export const N_CLICKER_ENABLED = "ClickerEnabled";

// LapServlet fields
export const N_REGATTA_INFO = "regattaInfo";
export const N_RESULTS = "results";

export const PUBLIC_REGATTA_ATTRS = [N_NAME, N_OWNER, N_ADMINS, N_TITLE, N_DATE, N_INFO_TEXT, N_FINISHED, N_RACE_TYPE];
export const CSV_PRIORITY_FIELDS = [N_DAY, N_EVENT_NAME, N_CREW, N_STROKE, N_BOW, N_AGE,
    N_HANDICAP, N_HANDICAP_CODE];
export const NO_INHERIT_FIELDS = [N_CREW, N_CREW_ABBREV, N_HANDICAP, N_HANDICAP_CODE,
N_PENALTY_CODES, N_PENALTY_CODES_TITLE, N_PENALTY_TIME, N_PENALTY_TIME_MS, N_AGE, N_EXHIBITION];
export const REGATTA_CONFIG_FIELDS =[N_NAME, N_DATE, N_TITLE, N_DOC_URL, N_FINISHED, N_PUBLIC, 
    N_HANDICAP_TYPE, N_HANDICAP_MULTIPLIER, N_CUSTOM_CODES, N_INFO_TEXT, N_MOBILE_PIN, N_RACE_TYPE,
    N_WAYPOINTS, N_RESULT_WAYPOINTS];

// ServerUtils fields
export const N_IS_USER_ADMIN = "isUserAdmin";
export const N_IS_USER_LOGGED_IN = "isUserLoggedIn";
export const N_USER_EMAIL = "UserEmail";
export const N_ALL_EVENTS = "All Events";
export const N_CREWTIMER_REMOTE_ENABLE = "crewtimerRemoteEnable";

export const N_SCRATCH = "Scratch";
export const N_DQ = "DQ";
export const N_EXCLUDE = "EXC";

// penalties
export const N_DID_NOT_START = "DNS";
export const N_DID_NOT_FINISH = "DNF";
export const N_PENALTIES_LIST = [
    "Custom",
    "Did Not Start",
    "Did Not Finish",
    "Missed Course Buoy: 10s",
    "Out Of Order Start: 10s",
    "Start Staging Yield: 10s",
    "Failure To Yield: 30s",
    "Missing Bow #: 60s",
    "Time Adjust"
];
export const N_PENALTIES_ABBREV = [
    "",
    ":" + N_DID_NOT_START, // leading colon suppresses time editbox
    ":" + N_DID_NOT_FINISH,
    "Buoy",
    "Order",
    "Staging",
    "FTYield",
    "Bow #",
    N_GATE_ADJ
];

export const N_SERVICE_USER_LIST = "UserList";  // Query / Set user info
export const N_USER = "User";
export const N_OP_GET_USERS = "GetUsers";
export const N_OP_UPDATE_USER = "UpdateUser";
export const N_OP_VALIDATE_USER = "ValidateUser";
export const N_OP_GET_REGATTA_NAMES = "GetRegattaNames";
export const N_OP_GET_REGATTA_RESULTS = "getResults";

export const N_OPERATION = "op";

// User levels
export const N_USER_LEVEL = "UserLevel";
export const N_USER_LEVEL_GUEST = 0;
export const N_USER_LEVEL_NORMAL = 1;
export const N_USER_LEVEL_ADMIN = 1000;

// Cookie names
export const N_COOKIE_PAGE = "page";

// Database Global Table Names
export const N_TABLE_REGATTALIST = "RegattaList";
export const N_TABLE_CHANNELS = "Channels";
export const N_TABLE_TWITTER_REQUEST_TOKEN = "TwitterRequestToken";

// Database Regatta Table Names
export const N_TABLE_LAPDATA = "LapData";
export const N_TABLE_TRANSACTION_LOG = "TransactionLog";
export const N_TABLE_TWEETS = "Tweets";