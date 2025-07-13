package com.ithouse.mshop.core.utils;

import java.io.File;
import java.util.Random;
import java.util.UUID;

public class Utils {

    public static void makDir(String path) throws Exception{
        if(path != null){
            File d = new File(path);
            if(!d.exists()){
                d.mkdirs();
            }
        }
    }


	public static String makeLink() {
		return UUID.randomUUID().toString().replace("-", "");
	}

	public static String makeNewOtp(int length) {
		Random random = new Random();
        StringBuilder otp = new StringBuilder();

        // Generate 'length' number of digits
        for (int i = 0; i < length; i++) {
            // Append a random digit (0-9) to the OTP
            otp.append(random.nextInt(10));
        }

        return otp.toString();
	}
	
	public static String convertToCamelCase(String blockLetter) {
        StringBuilder camelCase = new StringBuilder();
        String[] words = blockLetter.split("[_-]");
        
        for (int i = 0; i < words.length; i++) {
            String word = words[i].toLowerCase();
//            if (i != 0) {
//                // Capitalize first letter of each word except the first one
//                word = Character.toUpperCase(word.charAt(0)) + word.substring(1);
//            }
            camelCase.append(Character.toUpperCase(word.charAt(0)) + word.substring(1)+ " ");
        }
        
        return camelCase.toString();
    }

}
