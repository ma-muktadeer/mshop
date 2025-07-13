//package com.ithouse.mshop.core.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import com.ithouse.mshop.core.entity.User;
//import com.ithouse.mshop.core.repository.UserRepo;
//
//@Service
//public class CustomUserDetailsService implements UserDetailsService {
//
//    private final UserRepo userRepo;
//
//	public CustomUserDetailsService(UserRepo userRepo) {
//		this.userRepo = userRepo;
//	}
//
//	@Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        // load user from database
//    	User user = null;
//    	if(username.equals("ithousebd") || username.equals("ithousebd.admin.com")) {
//    		user = userRepo.findAllByLoginNameOrEmailAndActive(username, username, 1)
//                    .orElseThrow(() -> new UsernameNotFoundException("User not found."));
//    	}else {
//			user = userRepo
//					.findAllByLoginNameOrEmailAndAppNameAndActive(username, username, "M-SHOP", 1 )
//                    .orElseThrow(() -> new UsernameNotFoundException("User not found."));
//    	}
//
//
//        return user;
//    }
//}
