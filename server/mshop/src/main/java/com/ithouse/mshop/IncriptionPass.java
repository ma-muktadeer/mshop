package com.ithouse.mshop;

import com.ihouse.core.security.AbstractSecurity;

public class IncriptionPass {

    public static void main(String[] args) {
        AbstractSecurity abstractSecurity = new AbstractSecurity() {
            @Override
            public String encrypt(String arg0) throws Exception {
                return super.encrypt("esig-123");
            }
        };
    }
}
