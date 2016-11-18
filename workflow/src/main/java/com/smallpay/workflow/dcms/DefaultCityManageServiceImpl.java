package com.smallpay.workflow.dcms;

import com.smallpay.workflow.dcms.entity.CaseInfo;
import com.smallpay.workflow.dcms.entity.Department;
import com.smallpay.workflow.dcms.entity.Grid;
import org.activiti.engine.ManagementService;
import org.activiti.engine.impl.interceptor.Command;
import org.activiti.engine.impl.interceptor.CommandContext;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class DefaultCityManageServiceImpl implements CityManageService {

    @Autowired
    ManagementService managementService;

    @Override
    public CaseInfo getCaseInfo(int caseId) {
        return null;
    }

    @Override
    public void updateCaseInfoStatus(int caseId, int status) {

    }

    @Override
    public Department getDepartment(int departmentId) {
        Department department = managementService.executeCommand(new RawCommand<Department>() {
            @Override
            public Department executeRaw(SqlSession sqlSession) {
                return sqlSession.selectOne("getDepartmentById", departmentId);
            }
        });

        List<String> userList = managementService.executeCommand(new RawCommand<List<String>>() {
            @Override
            public List<String> executeRaw(SqlSession sqlSession) {
                return sqlSession.selectList("getDepartmentAndSubUserList", departmentId);
            }
        });

        department.setAllUserList(userList);
        return department;
    }

    @Override
    public Grid getGrid(String code) {
        return managementService.executeCommand(new RawCommand<Grid>() {
            @Override
            public Grid executeRaw(SqlSession sqlSession) {
                return sqlSession.selectOne("getGridByCode", code);
            }
        });
    }

    static abstract class RawCommand<T> implements Command<T> {

        @Override
        public T execute(CommandContext commandContext) {
            return executeRaw(commandContext.getDbSqlSession().getSqlSession());
        }

        public abstract T executeRaw(SqlSession sqlSession);
    }
}
