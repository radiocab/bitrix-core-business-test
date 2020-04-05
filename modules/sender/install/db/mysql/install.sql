CREATE TABLE b_sender_list
(
  ID		int(11)		NOT NULL auto_increment,
  NAME		VARCHAR(100)	NULL,
  CODE		VARCHAR(60)	NULL,
  SORT		int(11)		DEFAULT 100 NOT NULL,
  PRIMARY KEY (ID)
);
CREATE TABLE b_sender_contact
(
  ID		int(11)		NOT NULL auto_increment,
  DATE_INSERT	DATETIME	NOT NULL,
  DATE_UPDATE	DATETIME	NULL,
  TYPE_ID	INT(11) NOT NULL DEFAULT 1,
  CODE		VARCHAR(255)	NULL,
  NAME		VARCHAR(255)	NULL,
  USER_ID		INT(11)	NULL,
  BLACKLISTED CHAR(1) DEFAULT 'N' NOT NULL,
  IS_READ CHAR(1) DEFAULT 'N' NOT NULL,
  IS_CLICK CHAR(1) DEFAULT 'N' NOT NULL,
  IS_UNSUB CHAR(1) DEFAULT 'N' NOT NULL,
  IP VARCHAR(15) NULL,
  AGENT INT(11) DEFAULT 0 NOT NULL,
  PRIMARY KEY (ID),
  UNIQUE UK_B_SENDER_CONTACT_TYPE_CODE (TYPE_ID, CODE)
);
CREATE TABLE b_sender_contact_list
(
	CONTACT_ID	int(11) NOT NULL,
	LIST_ID	int(11) NOT NULL,
	UNIQUE UK_SENDER_CONTACT_LIST (CONTACT_ID,LIST_ID)
);
CREATE INDEX IX_SENDER_CONTACT_LIST_LST_ID on b_sender_contact_list(LIST_ID);

CREATE TABLE b_sender_group
(
  ID INT(11) NOT NULL auto_increment,
  CODE VARCHAR(30) NULL,
  NAME VARCHAR(100) NULL,
  DESCRIPTION TEXT NULL,
  SORT INT(11) DEFAULT 100 NOT NULL,
  ACTIVE CHAR(1) DEFAULT 'Y' NOT NULL,
  HIDDEN CHAR(1) DEFAULT 'N' NOT NULL,
  SYSTEM CHAR(1) DEFAULT 'N' NOT NULL,
  ADDRESS_COUNT INT(11) DEFAULT 0 NOT NULL,
  USE_COUNT INT(11) DEFAULT 0 NOT NULL,
  USE_COUNT_EXCLUDE INT(11) DEFAULT 0 NOT NULL,
  DATE_INSERT	DATETIME NULL,
  DATE_USE DATETIME NULL,
  DATE_USE_EXCLUDE DATETIME NULL,
  UNIQUE UK_SENDER_GROUP_CODE (CODE),
  PRIMARY KEY (ID)
);
CREATE TABLE b_sender_group_connector
(
  GROUP_ID int(11) NOT NULL,
  NAME		VARCHAR(100)	NULL,
  ENDPOINT	LONGTEXT	NULL,
  ADDRESS_COUNT	INT(11)		DEFAULT 0 NOT NULL
);
CREATE INDEX IX_SENDER_GROUP_CONNECTOR on b_sender_group_connector(GROUP_ID);
CREATE TABLE b_sender_group_counter
(
  GROUP_ID INT(11) NOT NULL,
  TYPE_ID	INT(11) NOT NULL,
  CNT	INT(11)	DEFAULT 0 NOT NULL,
  UNIQUE UK_SENDER_GROUP_COUNTER (GROUP_ID,TYPE_ID),
  INDEX IX_SENDER_GROUP_COUNTER (GROUP_ID)
);

CREATE TABLE b_sender_mailing
(
	ID		INT(11)		NOT NULL auto_increment,
  DATE_INSERT	datetime	NULL,
  NAME		varchar(100)		 NULL,
  DESCRIPTION	TEXT		NULL,
  ACTIVE	CHAR(1)		DEFAULT 'Y' NOT NULL,
  SITE_ID		CHAR(2)		NOT NULL,
  SORT		int(11)		DEFAULT 100 NOT NULL,
  IS_PUBLIC CHAR(1) DEFAULT 'Y' NOT NULL,
	TRACK_CLICK		CHAR(1)		DEFAULT 'N' NOT NULL,
  TRIGGER_FIELDS TEXT NULL,
  EMAIL_FROM VARCHAR(255) NULL,
  IS_TRIGGER char(1) default 'N'  NOT NULL,
	PRIMARY KEY (ID)
);
CREATE TABLE b_sender_mailing_chain
(
  ID		INT(11)		NOT NULL auto_increment,
  MAILING_ID	int(11) NOT NULL,
  STATUS		CHAR(1)		NOT NULL,
  POSTING_ID	INT(11) NULL,
  CREATED_BY	INT(11) NULL,
  PARENT_ID int(11) NULL,
  MESSAGE_CODE VARCHAR(20) NOT NULL DEFAULT 'mail',
  MESSAGE_ID VARCHAR(20) NOT NULL,
  IS_TRIGGER char(1) default 'N'  NOT NULL,
  IS_ADS char(1) default 'N'  NOT NULL,
  DATE_INSERT DATETIME NULL,
  TIME_SHIFT int(11) default 0 NOT NULL,
  LAST_EXECUTED	datetime	NULL,
  AUTO_SEND_TIME	datetime	NULL,
	TITLE varchar(255) null,
	EMAIL_FROM varchar(255) null,
	SUBJECT varchar(255),
	MESSAGE longtext,
  PRIORITY varchar(60),
  LINK_PARAMS varchar(255),
  TEMPLATE_TYPE varchar(30) NULL,
  TEMPLATE_ID varchar(60) NULL,
  REITERATE	CHAR(1)		DEFAULT 'N' NOT NULL,
  DAYS_OF_MONTH	VARCHAR(100)	NULL,
  DAYS_OF_WEEK	VARCHAR(15)	NULL,
  TIMES_OF_DAY	VARCHAR(255)	NULL,
  SEARCH_CONTENT longtext,
  PRIMARY KEY (ID)
);
CREATE INDEX IX_SENDER_MAILING_CHAIN_MAILING on b_sender_mailing_chain(MAILING_ID, STATUS);
CREATE INDEX IX_SENDER_MAILING_CHAIN_REITERATE on b_sender_mailing_chain(REITERATE, STATUS);

CREATE TABLE b_sender_mailing_chain_group
(
  CHAIN_ID	INT(11) NOT NULL,
  GROUP_ID	INT(11) NOT NULL,
  INCLUDE	INT(1)		DEFAULT 0 NOT NULL,
  UNIQUE UK_SENDER_MAILING_CH_GROUP (CHAIN_ID,GROUP_ID,INCLUDE)
);
CREATE TABLE b_sender_mailing_group
(
  MAILING_ID	INT(11) NOT NULL,
  GROUP_ID	INT(11) NOT NULL,
  INCLUDE	INT(1)		DEFAULT 0 NOT NULL,
  UNIQUE UK_SENDER_MAILING_GROUP (MAILING_ID,GROUP_ID, INCLUDE)
);
CREATE TABLE b_sender_mailing_subscription
(
  MAILING_ID int(11) not null,
  CONTACT_ID INT(11) not NULL,
  DATE_INSERT	DATETIME NULL,
  IS_UNSUB CHAR(1) DEFAULT 'N'  NOT NULL,
  PRIMARY KEY (MAILING_ID, CONTACT_ID, IS_UNSUB)
);
CREATE TABLE b_sender_posting
(
  ID		INT(11)		NOT NULL auto_increment,
  DATE_UPDATE	datetime	NULL,
  MAILING_ID	int(11) NOT NULL,
  MAILING_CHAIN_ID	int(11) NOT NULL,
  STATUS		CHAR(1)		DEFAULT 'D' NOT NULL,
  DATE_SEND	DATETIME NULL,
  DATE_PAUSE	DATETIME NULL,
  DATE_SENT	DATETIME NULL,
  DATE_CREATE	DATETIME	NULL,
  COUNT_SEND_ALL int(11) DEFAULT 0 NOT NULL,
  COUNT_SEND_NONE int(11) DEFAULT 0 NOT NULL,
  COUNT_SEND_ERROR int(11) DEFAULT 0 NOT NULL,
  COUNT_SEND_SUCCESS int(11) DEFAULT 0 NOT NULL,
  COUNT_SEND_DENY int(11) DEFAULT 0 NOT NULL,
  COUNT_READ int(11) DEFAULT 0 NOT NULL,
  COUNT_CLICK int(11) DEFAULT 0 NOT NULL,
  COUNT_UNSUB int(11) DEFAULT 0 NOT NULL,
  PRIMARY KEY (ID)
);
CREATE INDEX IX_SENDER_POSTING_MAILING_CHAIN on b_sender_posting(MAILING_ID, STATUS);
CREATE INDEX IX_SENDER_POSTING_MAILING on b_sender_posting(MAILING_CHAIN_ID, STATUS);

CREATE TABLE b_sender_posting_recipient
(
  ID INT(11) NOT NULL auto_increment,
  POSTING_ID INT(11) NOT NULL,
  CONTACT_ID int(11) NOT NULL,
  STATUS CHAR(1) NOT NULL,
  DATE_SENT	DATETIME	NULL,
  USER_ID INT(11) NULL,
  DATE_DENY DATETIME  NULL,
  FIELDS VARCHAR(2000) NULL,
  ROOT_ID int(11) NULL,

  IS_READ   char(1) DEFAULT 'N' NOT NULL,
  IS_CLICK  char(1) DEFAULT 'N' NOT NULL,
  IS_UNSUB  char(1) DEFAULT 'N' NOT NULL,
  PRIMARY KEY (ID),
  UNIQUE UK_SENDER_POSTING_RCPNT (POSTING_ID, CONTACT_ID)
);
CREATE INDEX IX_SENDER_POSTING_RECIP_1 on b_sender_posting_recipient(POSTING_ID, STATUS);

CREATE TABLE b_sender_posting_read
(
  ID INT(11) NOT NULL auto_increment,
  POSTING_ID INT(11) NOT NULL,
  RECIPIENT_ID INT(11),
  DATE_INSERT	datetime	NULL,
  PRIMARY KEY (ID)
);
CREATE INDEX IX_SENDER_POSTING_READ on b_sender_posting_read(POSTING_ID, RECIPIENT_ID);
CREATE INDEX ix_b_sender_posting_read_recip_id ON b_sender_posting_read (RECIPIENT_ID);

CREATE TABLE b_sender_posting_click
(
  ID INT(11) NOT NULL auto_increment,
  POSTING_ID INT(11) NOT NULL,
  RECIPIENT_ID INT(11),
  DATE_INSERT	datetime	NULL,
  URL	VARCHAR(2000) 	NULL,
  PRIMARY KEY (ID)
);
CREATE INDEX IX_SENDER_POSTING_CLICK on b_sender_posting_click(POSTING_ID, RECIPIENT_ID);
CREATE INDEX IX_SENDER_POSTING_CLICK_RCPID on b_sender_posting_click(RECIPIENT_ID);

CREATE TABLE b_sender_posting_unsub
(
  ID INT(11) NOT NULL auto_increment,
  RECIPIENT_ID int(11) NOT NULL,
  POSTING_ID INT(11) NOT NULL,
  DATE_INSERT	datetime	NULL,
  PRIMARY KEY (ID)
);
CREATE INDEX IX_SENDER_POSTING_UNSUB on b_sender_posting_unsub(POSTING_ID, RECIPIENT_ID);

CREATE TABLE b_sender_preset_template
(
  ID INT(11) NOT NULL AUTO_INCREMENT,
  ACTIVE CHAR(1) DEFAULT 'Y' NOT NULL,
  NAME VARCHAR(50) NOT NULL,
  CONTENT LONGTEXT NULL,
  USE_COUNT INT(11) DEFAULT 0 NOT NULL,
  DATE_INSERT	DATETIME NULL,
  DATE_USE DATETIME NULL,
  PRIMARY KEY (ID)
);
CREATE TABLE b_sender_mailing_attachment
(
  CHAIN_ID int(18) not null,
  FILE_ID int(18) not null,
  PRIMARY KEY (CHAIN_ID, FILE_ID)
);
CREATE TABLE b_sender_mailing_trigger
(
  MAILING_CHAIN_ID int(11) not null,
  IS_TYPE_START int(1) default 1 not null,
  NAME VARCHAR(255) NULL,
  EVENT VARCHAR(255) NOT NULL,
  ENDPOINT TEXT NOT NULL
);
CREATE TABLE b_sender_message
(
  ID INT(11) NOT NULL auto_increment,
  CODE VARCHAR(255) NOT NULL,
  PRIMARY KEY (ID)
);
CREATE TABLE b_sender_message_field
(
  MESSAGE_ID INT(11) NOT NULL,
  CODE VARCHAR(255) NOT NULL,
  TYPE VARCHAR(20) NOT NULL,
  VALUE LONGTEXT NULL,
  PRIMARY KEY (MESSAGE_ID, CODE),
  INDEX IX_SENDER_MESSAGE_FIELD (MESSAGE_ID)
);
CREATE TABLE b_sender_call_log
(
  CALL_ID VARCHAR(255) NOT NULL,
  RECIPIENT_ID INT(11) NOT NULL,
  DATE_INSERT DATETIME NOT NULL,
  PRIMARY KEY (CALL_ID, RECIPIENT_ID)
);

CREATE TABLE IF NOT EXISTS b_sender_agreement (
  ID INT(11) NOT NULL auto_increment,
  USER_ID int(10) unsigned NOT NULL,
  `NAME` varchar(100) NOT NULL,
  EMAIL varchar(255) NOT NULL,
  `DATE` datetime NOT NULL,
  IP_ADDRESS varchar(39) NOT NULL COMMENT 'ipv4 or ipv6',
  PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS b_sender_abuse (
  ID INT(11) NOT NULL auto_increment,
  TEXT TEXT NULL,
  CONTACT_ID int(11) unsigned NULL,
  CONTACT_TYPE_ID int(11) unsigned NULL,
  CONTACT_CODE varchar(255) NOT NULL,
  DATE_INSERT datetime NOT NULL,
  PRIMARY KEY (ID),
  INDEX IX_SENDER_ABUSE_DATE_INSERT (DATE_INSERT)
);

CREATE TABLE IF NOT EXISTS b_sender_counter_daily
(
  DATE_STAT DATE NOT NULL,
  SENT_CNT INT NOT NULL DEFAULT 0,
  ABUSE_CNT INT NOT NULL DEFAULT 0,
  PRIMARY KEY (DATE_STAT)
);

CREATE TABLE IF NOT EXISTS b_sender_queue
(
  ENTITY_TYPE varchar(20) NOT NULL,
  ENTITY_ID varchar(10) NOT NULL,
  LAST_ITEM varchar(255) NOT NULL,
  PRIMARY KEY (ENTITY_TYPE, ENTITY_ID)
);

CREATE TABLE IF NOT EXISTS b_sender_role
(
  ID int(11) NOT NULL auto_increment,
  NAME varchar(255) NOT NULL,
  XML_ID varchar(255) NULL,
  PRIMARY KEY PK_B_SENDER_ROLE (ID),
  KEY IX_SENDER_ROLE_XML_ID (XML_ID)
);


CREATE TABLE IF NOT EXISTS b_sender_role_permission
(
  ID int(11) NOT NULL auto_increment,
  ROLE_ID int(11) NOT NULL,
  ENTITY varchar(50) NOT NULL,
  ACTION varchar(50) NOT NULL,
  PERMISSION char(1) NULL,
  PRIMARY KEY PK_B_SENDER_ROLE_PERMISSION (ID),
  KEY IX_SENDER_ROLE_PERM_ROLE_ID (ROLE_ID)
);

CREATE TABLE IF NOT EXISTS b_sender_role_access
(
  ID int(11) NOT NULL auto_increment,
  ROLE_ID int(11) NOT NULL,
  ACCESS_CODE varchar(100) NOT NULL,
  PRIMARY KEY PK_B_SENDER_ROLE_ACCESS (ID),
  KEY IX_SENDER_ROLE_ACC_ROLE_ID (ROLE_ID)
);

CREATE TABLE IF NOT EXISTS b_sender_counter
(
  CODE varchar(25) NOT NULL,
  VALUE int(11) NOT NULL DEFAULT 0,
  DATE_UPDATE DATETIME NOT NULL,
  PRIMARY KEY PK_SENDER_COUNDER_CODE (CODE)
);