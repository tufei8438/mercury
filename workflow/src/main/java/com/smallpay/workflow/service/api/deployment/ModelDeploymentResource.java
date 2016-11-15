package com.smallpay.workflow.service.api.deployment;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.ActivitiException;
import org.activiti.engine.ActivitiIllegalArgumentException;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.Model;
import org.activiti.rest.service.api.RestResponseFactory;
import org.activiti.rest.service.api.repository.DeploymentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class ModelDeploymentResource {

    @Autowired
    RestResponseFactory restResponseFactory;

    @Autowired
    RepositoryService repositoryService;

    @RequestMapping(value="/service/repository/deployments", method = RequestMethod.POST, produces = "application/json")
    public DeploymentResponse deploy(@RequestParam("modelId") String modelId) {
        Model modelData = repositoryService.getModel(modelId);
        if (modelData == null) {
            throw new ActivitiIllegalArgumentException("Invalid modelId:" + modelId);
        }

        try {
            Deployment deployment = deployModelerModel(modelData);
            return restResponseFactory.createDeploymentResponse(deployment);
        } catch (IOException e) {
            throw new ActivitiException("Deploy model error", e);
        }
    }

    private Deployment deployModelerModel(final Model modelData) throws IOException {
        ObjectNode modelNode = (ObjectNode) new ObjectMapper().readTree(
                repositoryService.getModelEditorSource(modelData.getId()));
        BpmnModel model = new BpmnJsonConverter().convertToBpmnModel(modelNode);
        byte[] bpmnBytes = new BpmnXMLConverter().convertToXML(model);

        String processName = modelData.getName() + ".bpmn20.xml";
        return repositoryService.createDeployment().name(modelData.getName())
                .addString(processName, new String(bpmnBytes)).deploy();
    }
}
