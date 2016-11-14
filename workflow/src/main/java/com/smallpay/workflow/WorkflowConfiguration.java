package com.smallpay.workflow;

import com.smallpay.workflow.dcms.CityManageService;
import com.smallpay.workflow.dcms.DefaultCityManageServiceImpl;
import org.activiti.engine.delegate.JavaDelegate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WorkflowConfiguration {

//    @Bean
//    public JavaDelegate caseAutoRegister() {
//        return new CaseAutoRegister();
//    }
//
//    @Bean
//    public JavaDelegate caseAutoComplete() {
//        return new CaseAutoComplete();
//    }

    @Bean
    public CityManageService cityManageService() {
        return new DefaultCityManageServiceImpl();
    }
}
