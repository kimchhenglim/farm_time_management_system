package com.example.comp9034.enums;

public enum StationEnum {
    ACTIVE(Group.STATUS),
    INACTIVE(Group.STATUS),
    ;

    private final Group group;


    StationEnum(Group group) {
        this.group = group;
    }

    public Group getGroup() {
        return this.group;
    }

    public enum Group {
        STATUS,


    }
}
