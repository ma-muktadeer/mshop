package com.ithouse.mshop;

import com.ithouse.core.security.EncryptDecryptService;

public class IncriptionPass {

    public static void main(String[] args) throws Exception {
        var s = EncryptDecryptService.encrypt("esig-123");
        //IO.println("Encrypt data: " + s);
    }
}
