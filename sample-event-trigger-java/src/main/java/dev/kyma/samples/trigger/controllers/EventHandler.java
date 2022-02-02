package dev.kyma.samples.trigger.controllers;

import dev.kyma.samples.trigger.model.OrderCreated;
import io.cloudevents.CloudEvent;
import io.cloudevents.spring.http.CloudEventHttpUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/")
public class EventHandler {

    @PostMapping
    public ResponseEntity handle(@RequestHeader HttpHeaders headers,
                                 @RequestBody OrderCreated orderCreated) {
        CloudEvent cloudevent = CloudEventHttpUtils.fromHttp(headers).build();

        cloudevent.getAttributeNames().forEach(name -> {
            System.out.println(name + ": " + cloudevent.getAttribute(name));
        });
        System.out.println(orderCreated);
        //implement your business extension logic here
        return ResponseEntity.accepted().build();
    }
}
