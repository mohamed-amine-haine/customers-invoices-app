<?php 

namespace App\EventSubscribers;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerEventSubscriber implements EventSubscriberInterface
{
  /**
   * security
   *
   * @var Security
   */
  private $security;

  public function __construct(Security $security)
  {
    $this->security = $security;
  }

  public static function getSubscribedEvents()
  {
    return [
      KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
    ];
  }


  public function setUserForCustomer(ViewEvent $viewEvent)
  {
    $customer = $viewEvent->getControllerResult();
    $method = $viewEvent->getRequest()->getMethod();

    if($customer instanceof Customer && $method == 'POST')
    {
      $customer->setUser($this->security->getUser());    
    }
  }

}