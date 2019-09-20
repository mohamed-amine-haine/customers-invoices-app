<?php

namespace App\EventSubscribers;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtEventSubscriber {

  public function onJWTCreated(JWTCreatedEvent $event)
  {
    $payload = $event->getData();
    $payload['firstName'] = $event->getUser()->getFirstName();
    $payload['lastName'] = $event->getUser()->getLastName();

    $event->setData($payload);
  }
  
}