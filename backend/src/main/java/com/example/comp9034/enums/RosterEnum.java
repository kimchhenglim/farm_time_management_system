package com.example.comp9034.enums;

public enum RosterEnum {
    PUBLISHED(Group.STATUS),
    UPDATED(Group.STATUS),
    ARCHIVED(Group.STATUS),
    DRAFT(Group.STATUS),
    ;

    private final Group group;


    RosterEnum(Group group) {
        this.group = group;
    }

    public Group getGroup() {
        return this.group;
    }

    public enum Group {
        STATUS,


    }
}
