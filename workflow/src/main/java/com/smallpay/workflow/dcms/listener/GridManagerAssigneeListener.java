package com.smallpay.workflow.dcms.listener;

import com.smallpay.workflow.dcms.CityManageService;
import com.smallpay.workflow.dcms.entity.CaseInfo;
import com.smallpay.workflow.dcms.entity.Grid;
import org.activiti.engine.ActivitiException;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.springframework.beans.factory.annotation.Autowired;

public class GridManagerAssigneeListener implements TaskListener {

    @Autowired
    CityManageService cityManageService;

    @Override
    public void notify(DelegateTask delegateTask) {
        Integer caseId = delegateTask.getVariable("case_id", Integer.class);
        CaseInfo caseInfo = cityManageService.getCaseInfo(caseId);
        if (caseInfo == null) {
            return;
        }

        if (caseInfo.getGridCode() != null) {
            Grid grid = cityManageService.getGrid(caseInfo.getGridCode());
            delegateTask.setAssignee(grid.getUsercode());
        }
    }
}
