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

INSERT INTO report (title, description, created, last_modified, created_by, last_modified_by) VALUES
  ("Ruth Bader Ginsburg", "Report about an American lawyer and jurist who is an Associate Justice of the U.S. Supreme Court.", NOW(), NOW(), "randy@gmail.com", "randy@gmail.com"),
  ("My Dog Rose", "Report about my dog Rose who enjoys leash laws.", NOW(), NOW(), "randy@gmail.com", "randy@gmail.com"),
  ("Three Blind Mice", "Report about seeing how mice run", NOW(), NOW(), "randy@gmail.com", "randy@gmail.com");
