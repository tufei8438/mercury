package com.smallpay.workflow;

import com.smallpay.workflow.dcms.CityManageService;
import com.smallpay.workflow.dcms.DefaultCityManageServiceImpl;
import com.smallpay.workflow.dcms.delegate.CaseAutoComplete;
import com.smallpay.workflow.dcms.delegate.CaseAutoRegister;
import com.smallpay.workflow.dcms.listener.DepartmentAssigneeListener;
import com.smallpay.workflow.dcms.listener.GridManagerAssigneeListener;
import org.activiti.engine.delegate.JavaDelegate;
import org.activiti.engine.delegate.TaskListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WorkflowConfiguration {

    @Bean
    public JavaDelegate caseAutoRegister() {
        return new CaseAutoRegister();
    }

    @Bean
    public JavaDelegate caseAutoComplete() {
        return new CaseAutoComplete();
    }

    @Bean
    public CityManageService cityManageService() {
        return new DefaultCityManageServiceImpl();
    }

    @Bean
    public TaskListener departmentAssigneeLister() {
        return new DepartmentAssigneeListener();
    }

    @Bean
    public TaskListener gridManagerAssigneeListener() {
        return new GridManagerAssigneeListener();
    }
}
