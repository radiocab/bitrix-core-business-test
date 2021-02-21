CREATE TABLE IF NOT EXISTS b_rest_event
(
	ID int(11) NOT NULL AUTO_INCREMENT,
	APP_ID int(11) NULL,
	EVENT_NAME varchar(255) NOT NULL ,
	EVENT_HANDLER varchar(255) NOT NULL,
	USER_ID int(11) NULL DEFAULT 0,
	TITLE VARCHAR(255) NULL DEFAULT '',
	COMMENT VARCHAR(255) NULL DEFAULT '',
	DATE_CREATE DATETIME NULL,
	APPLICATION_TOKEN VARCHAR(50) NULL DEFAULT '',
	CONNECTOR_ID VARCHAR(255) NULL DEFAULT '',
	INTEGRATION_ID INT(11) NULL,
	OPTIONS VARCHAR(1024) NULL,
	PRIMARY KEY (ID),
	UNIQUE ux_b_rest_event_app_event (APP_ID, EVENT_NAME(50), EVENT_HANDLER(180), USER_ID, CONNECTOR_ID(70)),
	INDEX ix_b_rest_event_event_name (EVENT_NAME)
);

CREATE TABLE IF NOT EXISTS b_rest_app
(
	ID INT(11) NOT NULL AUTO_INCREMENT,
	CLIENT_ID VARCHAR(128) NOT NULL,
	CODE VARCHAR(128) NOT NULL,
	ACTIVE CHAR(1) NOT NULL DEFAULT 'Y',
	INSTALLED CHAR(1) NOT NULL DEFAULT 'N',
	URL VARCHAR(1000) NOT NULL,
	URL_DEMO VARCHAR(1000) NULL,
	URL_INSTALL VARCHAR(1000) NULL,
	VERSION VARCHAR(4) NULL DEFAULT '1',
	SCOPE VARCHAR(2000) NOT NULL,
	STATUS CHAR(1) NOT NULL DEFAULT 'F',
	DATE_FINISH DATE NULL,
	IS_TRIALED CHAR(1) NULL DEFAULT 'N',
	SHARED_KEY VARCHAR(32) NULL DEFAULT NULL,
	CLIENT_SECRET VARCHAR(100) NULL DEFAULT NULL,
	APP_NAME VARCHAR(1000) NULL DEFAULT NULL,
	ACCESS VARCHAR(2000) NULL DEFAULT '',
	APPLICATION_TOKEN VARCHAR(50) NULL DEFAULT '',
	MOBILE CHAR(1) NULL DEFAULT 'N',
	USER_INSTALL CHAR(1) NULL DEFAULT 'N',
	PRIMARY KEY (ID),
	UNIQUE INDEX ux_b_rest_app1 (CLIENT_ID)
);

CREATE TABLE IF NOT EXISTS b_rest_app_lang
(
	ID INT(11) NOT NULL AUTO_INCREMENT,
	APP_ID INT(11) NOT NULL,
	LANGUAGE_ID CHAR(2) NOT NULL,
	MENU_NAME VARCHAR(500) NULL,
	PRIMARY KEY (ID),
	UNIQUE INDEX ux_b_rest_app_lang1 (APP_ID, LANGUAGE_ID)
);

CREATE TABLE IF NOT EXISTS b_rest_ap
(
	ID INT(11) NOT NULL AUTO_INCREMENT,
	USER_ID INT(11) NOT NULL,
	PASSWORD VARCHAR(50) NOT NULL,
	ACTIVE CHAR(1) NULL DEFAULT 'Y',
	TITLE VARCHAR(255) NULL DEFAULT '',
	COMMENT VARCHAR(255) NULL DEFAULT '',
	DATE_CREATE DATETIME NULL,
	DATE_LOGIN DATETIME NULL,
	LAST_IP VARCHAR(255) NULL,
	PRIMARY KEY (ID),
	INDEX ix_b_rest_ap (USER_ID, PASSWORD, ACTIVE)
);

CREATE TABLE IF NOT EXISTS b_rest_ap_permission
(
	ID INT(11) NOT NULL AUTO_INCREMENT,
	PASSWORD_ID INT(11) NOT NULL,
	PERM VARCHAR(100) NOT NULL,
	PRIMARY KEY (ID),
	UNIQUE INDEX ux_b_rest_ap_perm1 (PASSWORD_ID,PERM)
);

CREATE TABLE IF NOT EXISTS b_rest_log
(
	ID INT(11) NOT NULL AUTO_INCREMENT,
	TIMESTAMP_X TIMESTAMP NOT NULL DEFAULT current_timestamp,
	CLIENT_ID VARCHAR(45) NULL,
	PASSWORD_ID INT(11) NULL,
	SCOPE VARCHAR(50) NULL,
	METHOD VARCHAR(255) NULL,
	REQUEST_METHOD VARCHAR(10) NULL,
	REQUEST_URI VARCHAR(255) NULL,
	REQUEST_AUTH TEXT NULL,
	REQUEST_DATA TEXT NULL,
	RESPONSE_STATUS VARCHAR(20) NULL,
	RESPONSE_DATA LONGTEXT NULL,
	PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS b_rest_placement
(
	ID INT(11) NOT NULL AUTO_INCREMENT,
	APP_ID INT(11) NULL,
	PLACEMENT VARCHAR(255) NOT NULL,
	PLACEMENT_HANDLER VARCHAR(255) NOT NULL,
	TITLE VARCHAR(255) NULL DEFAULT '',
	GROUP_NAME VARCHAR(255) NULL DEFAULT '',
	COMMENT VARCHAR(255) NULL DEFAULT '',
	DATE_CREATE DATETIME NULL,
	ADDITIONAL varchar(255) NULL,
	PRIMARY KEY (ID),
	UNIQUE ux_b_rest_placement1 (APP_ID, PLACEMENT(100), PLACEMENT_HANDLER(200)),
	INDEX ix_b_rest_placement3 (PLACEMENT(100), ADDITIONAL(100))
);

CREATE TABLE IF NOT EXISTS b_rest_event_offline
(
	ID INT(11) NOT NULL AUTO_INCREMENT,
	TIMESTAMP_X TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	MESSAGE_ID VARCHAR(100) NOT NULL,
	APP_ID INT(11) NOT NULL,
	EVENT_NAME VARCHAR(255) NOT NULL,
	EVENT_DATA text NULL,
	EVENT_ADDITIONAL text NULL,
	PROCESS_ID VARCHAR(255) NULL DEFAULT '',
	CONNECTOR_ID VARCHAR(255) NULL DEFAULT '',
	ERROR INT(3) NULL DEFAULT 0,
	PRIMARY KEY (ID),
	UNIQUE INDEX ux_b_rest_event_offline1 (MESSAGE_ID(50), APP_ID, CONNECTOR_ID(100), PROCESS_ID(50)),
	INDEX ix_b_rest_event_offline2 (TIMESTAMP_X)
);

CREATE TABLE IF NOT EXISTS b_rest_stat_method
(
	ID INT NOT NULL AUTO_INCREMENT,
	NAME VARCHAR(255) NOT NULL,
	METHOD_TYPE CHAR(1) NULL DEFAULT 'M',
	PRIMARY KEY (ID),
	UNIQUE INDEX ux_b_rest_stat_method (NAME)
);

CREATE TABLE IF NOT EXISTS b_rest_stat_app
(
	APP_ID INT NOT NULL,
	APP_CODE VARCHAR(128) NOT NULL,
	PRIMARY KEY (APP_ID),
	INDEX ix_b_rest_stat_app_code (APP_CODE)
);

CREATE TABLE IF NOT EXISTS b_rest_stat
(
	STAT_DATE DATE NOT NULL,
	APP_ID INT(11) NOT NULL,
	METHOD_ID INT NOT NULL,
	HOUR_0 INT NOT NULL DEFAULT 0,
	HOUR_1 INT NOT NULL DEFAULT 0,
	HOUR_2 INT NOT NULL DEFAULT 0,
	HOUR_3 INT NOT NULL DEFAULT 0,
	HOUR_4 INT NOT NULL DEFAULT 0,
	HOUR_5 INT NOT NULL DEFAULT 0,
	HOUR_6 INT NOT NULL DEFAULT 0,
	HOUR_7 INT NOT NULL DEFAULT 0,
	HOUR_8 INT NOT NULL DEFAULT 0,
	HOUR_9 INT NOT NULL DEFAULT 0,
	HOUR_10 INT NOT NULL DEFAULT 0,
	HOUR_11 INT NOT NULL DEFAULT 0,
	HOUR_12 INT NOT NULL DEFAULT 0,
	HOUR_13 INT NOT NULL DEFAULT 0,
	HOUR_14 INT NOT NULL DEFAULT 0,
	HOUR_15 INT NOT NULL DEFAULT 0,
	HOUR_16 INT NOT NULL DEFAULT 0,
	HOUR_17 INT NOT NULL DEFAULT 0,
	HOUR_18 INT NOT NULL DEFAULT 0,
	HOUR_19 INT NOT NULL DEFAULT 0,
	HOUR_20 INT NOT NULL DEFAULT 0,
	HOUR_21 INT NOT NULL DEFAULT 0,
	HOUR_22 INT NOT NULL DEFAULT 0,
	HOUR_23 INT NOT NULL DEFAULT 0,
	PRIMARY KEY (APP_ID, STAT_DATE, METHOD_ID)
);

CREATE TABLE IF NOT EXISTS b_rest_app_log
(
	ID INT NOT NULL AUTO_INCREMENT,
	TIMESTAMP_X TIMESTAMP NOT NULL DEFAULT current_timestamp,
	APP_ID INT NOT NULL,
	ACTION_TYPE VARCHAR(50) NOT NULL,
	USER_ID INT NOT NULL,
	USER_ADMIN CHAR(1) NULL DEFAULT 'Y',
	PRIMARY KEY (ID),
	INDEX ix_b_rest_app_log1 (APP_ID)
);

CREATE TABLE IF NOT EXISTS b_rest_usage_entity
(
	ID INT NOT NULL AUTO_INCREMENT,
	ENTITY_TYPE CHAR(1) NOT NULL,
	ENTITY_ID INT(11) NOT NULL,
	ENTITY_CODE VARCHAR(255) DEFAULT NULL,
	SUB_ENTITY_TYPE CHAR(1) NULL,
	SUB_ENTITY_NAME VARCHAR(255) NULL,
	PRIMARY KEY (ID),
	UNIQUE INDEX ix_b_rest_usage_entity (ENTITY_TYPE, ENTITY_ID, SUB_ENTITY_TYPE, SUB_ENTITY_NAME)
);

CREATE TABLE IF NOT EXISTS b_rest_usage_stat
(
	STAT_DATE DATE NOT NULL,
	ENTITY_ID INT(11) NOT NULL DEFAULT 0,
	IS_SENT CHAR(1) NOT NULL DEFAULT 'N',
	HOUR_0 INT NOT NULL DEFAULT 0,
	HOUR_1 INT NOT NULL DEFAULT 0,
	HOUR_2 INT NOT NULL DEFAULT 0,
	HOUR_3 INT NOT NULL DEFAULT 0,
	HOUR_4 INT NOT NULL DEFAULT 0,
	HOUR_5 INT NOT NULL DEFAULT 0,
	HOUR_6 INT NOT NULL DEFAULT 0,
	HOUR_7 INT NOT NULL DEFAULT 0,
	HOUR_8 INT NOT NULL DEFAULT 0,
	HOUR_9 INT NOT NULL DEFAULT 0,
	HOUR_10 INT NOT NULL DEFAULT 0,
	HOUR_11 INT NOT NULL DEFAULT 0,
	HOUR_12 INT NOT NULL DEFAULT 0,
	HOUR_13 INT NOT NULL DEFAULT 0,
	HOUR_14 INT NOT NULL DEFAULT 0,
	HOUR_15 INT NOT NULL DEFAULT 0,
	HOUR_16 INT NOT NULL DEFAULT 0,
	HOUR_17 INT NOT NULL DEFAULT 0,
	HOUR_18 INT NOT NULL DEFAULT 0,
	HOUR_19 INT NOT NULL DEFAULT 0,
	HOUR_20 INT NOT NULL DEFAULT 0,
	HOUR_21 INT NOT NULL DEFAULT 0,
	HOUR_22 INT NOT NULL DEFAULT 0,
	HOUR_23 INT NOT NULL DEFAULT 0,
	PRIMARY KEY (STAT_DATE, ENTITY_ID),
	INDEX ix_b_rest_usage (ENTITY_ID, STAT_DATE)
);

CREATE TABLE b_rest_owner_entity
(
	ID INT(11) NOT NULL AUTO_INCREMENT,
	OWNER_TYPE CHAR(1) NOT NULL,
	OWNER INT(11) NOT NULL,
	ENTITY_TYPE VARCHAR(32) NOT NULL,
	ENTITY VARCHAR(32) NOT NULL,
	PRIMARY KEY (ID),
	UNIQUE INDEX ix_b_rest_owner_entity (ENTITY_TYPE, ENTITY)
);
CREATE TABLE b_rest_integration (
	ID int(11) NOT NULL AUTO_INCREMENT,
	USER_ID int(11) DEFAULT NULL,
	ELEMENT_CODE varchar(256) NOT NULL,
	TITLE varchar(256) NOT NULL,
	PASSWORD_ID int(11) DEFAULT NULL,
	APP_ID int(11) DEFAULT NULL,
	SCOPE text,
	QUERY text,
	OUTGOING_EVENTS text,
	OUTGOING_NEEDED char(1) DEFAULT NULL,
	OUTGOING_HANDLER_URL varchar(2048) DEFAULT NULL,
	WIDGET_NEEDED char(1) DEFAULT NULL,
	WIDGET_HANDLER_URL varchar(2048) DEFAULT NULL,
	WIDGET_LIST text,
	APPLICATION_TOKEN varchar(50) DEFAULT NULL,
	APPLICATION_NEEDED char(1) DEFAULT NULL,
	APPLICATION_ONLY_API char(1) DEFAULT NULL,
	BOT_ID int(11) DEFAULT NULL,
	BOT_HANDLER_URL varchar(2048) DEFAULT NULL,
	PRIMARY KEY (ID)
);