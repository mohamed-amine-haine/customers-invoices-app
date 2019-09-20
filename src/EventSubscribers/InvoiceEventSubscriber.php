<?php 

namespace App\EventSubscribers;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceEventSubscriber implements EventSubscriberInterface
{
  /**
   * security
   *
   * @var Security
   */
  private $security;

  /**
   * invoice repository
   *
   * @var InvoiceRepository
   */
  private $invoiceRepository;

  public function __construct(Security $security, InvoiceRepository $invoiceRepository)
  {
    $this->security = $security;
    $this->invoiceRepository = $invoiceRepository;
  }

  public static function getSubscribedEvents()
  {
    return [
      KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
    ];
  }

  public function setChronoForInvoice(ViewEvent $viewEvent)
  {
    $invoice = $viewEvent->getControllerResult();
    $method = $viewEvent->getRequest()->getMethod();

    if($invoice instanceof Invoice && $method == 'POST')
    {
      $chrono = $this->invoiceRepository->findNextChrono($this->security->getUser());
      $invoice->setChrono($chrono);

      if(empty($invoice->getSentAt()))
      {
        $invoice->setSentAt(new \DateTime());
      }

    }
  }
  
}

