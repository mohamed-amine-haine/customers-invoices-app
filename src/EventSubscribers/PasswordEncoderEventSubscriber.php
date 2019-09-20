<?php

namespace App\EventSubscribers;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderEventSubscriber implements EventSubscriberInterface {
  /**
   * password encoder
   *
   * @var UserPasswordEncoderInterface
   */
  private $encoder;

  public function __construct(UserPasswordEncoderInterface $encoder)
  {
    $this->encoder = $encoder;
  }

  public static function getSubscribedEvents()
  {
    return [
      KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
    ];
  }


  public function encodePassword(ViewEvent $viewEvent)
  {
    $user = $viewEvent->getControllerResult();

    if($user instanceof User && $viewEvent->getRequest()->getMethod() === 'POST')
    {
      $hash = $this->encoder->encodePassword($user, $user->getPassword());
      $user->setPassword($hash);
    }
  }

}