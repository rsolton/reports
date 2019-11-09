CREATE DATABASE reports;

DROP TABLE IF EXISTS report;

CREATE TABLE report (
  id                            INT          NOT NULL AUTO_INCREMENT,
  title                         VARCHAR(100) NOT NULL DEFAULT '',
  description                   VARCHAR(4000),
  created                       DATETIME     NOT NULL DEFAULT NOW(),
  last_modified                 TIMESTAMP    NOT NULL,
  created_by                    VARCHAR(255),
  last_modified_by              VARCHAR(255),
  PRIMARY KEY (id)
);