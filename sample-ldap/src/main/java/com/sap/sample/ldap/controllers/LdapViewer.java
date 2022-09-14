package com.sap.sample.ldap.controllers;

import com.sap.sample.ldap.services.LdapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.naming.NamingException;

@RestController
@RequestMapping(path = "/users")
public class LdapViewer {
    private final LdapService ldapService;

    @Autowired
    public LdapViewer(LdapService ldapService) {
        this.ldapService = ldapService;
    }

    @GetMapping(path = "/{userName}")
    public String getUser(@PathVariable String userName) throws NamingException {
        return ldapService.SearchUser(userName);
    }
}
