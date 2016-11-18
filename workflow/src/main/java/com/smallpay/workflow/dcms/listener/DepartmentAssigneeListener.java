package com.smallpay.workflow.dcms.listener;

import com.smallpay.workflow.dcms.CityManageService;
import com.smallpay.workflow.dcms.entity.Department;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class DepartmentAssigneeListener implements TaskListener {

    @Autowired
    CityManageService cityManageService;

    @Override
    public void notify(DelegateTask delegateTask) {
        Integer departmentId = delegateTask.getVariable("department_id", Integer.class);
        Department department = cityManageService.getDepartment(departmentId);
        if (department == null) {
            return;
        }

        List<String> users = department.getAllUserList();
        if (users != null && users.size() > 0) {
            delegateTask.addCandidateUsers(department.getAllUserList());
        }
    }
}
