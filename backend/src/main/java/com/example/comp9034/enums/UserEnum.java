package com.example.comp9034.enums;

public enum UserEnum {
    ADMIN(Group.ROLE),
    STAFF(Group.ROLE),

    MALE(Group.GENDER),
    FEMALE(Group.GENDER),
    OTHER(Group.GENDER),

    FULLTIME(Group.CONTRACT_TYPE),
    PARTTIME(Group.CONTRACT_TYPE),
    CASUAL(Group.CONTRACT_TYPE),
    ;

    private final Group group;


    UserEnum(Group group) {
        this.group = group;
    }

    public Group getGroup() {
        return this.group;
    }

    public enum Group {
        ROLE,
        GENDER,
        CONTRACT_TYPE

    }
}
