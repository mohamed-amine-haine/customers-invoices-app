<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use App\Controller\IncrementInvoiceChrono;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 * @ApiResource(
 *  attributes = {
 *      "pagination_enabled" = false,
 *      "pagination_items_per_page" = 20,
 *      "order" = {"amount":"asc"}
 *  },
 *  itemOperations={
 *     "get", "put", "delete",
 *     "increment_invoice_chrono"={
 *         "method"="post",
 *         "path"="/invoices/{id}/increment",
 *         "controller"=IncrementInvoiceChrono::class,
 *     }
 *  },
 *  subresourceOperations={
 *      "api_customers_invoices_get_subresource"={
 *          "normalization_context"= {
 *              "groups"={"invoices_subresource_read"}
 *          }
 *      }    
 *  },
 *  normalizationContext = {
 *     "groups" = {"invoices_read"}
 *  },
 *  denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(SearchFilter::class, properties = {"id","chrono","customer.firstName"})
 * @ApiFilter(RangeFilter::class)
 * @ApiFilter(OrderFilter::class)
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource_read"})
     * @Assert\NotBlank(message="le amount est obligatoire")
     * @Assert\Type(type="numeric", message="le amount doit etre numerique")
     * @Assert\PositiveOrZero(message="le amount doit etre positif ou zero")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource_read"})
     * @Assert\DateTime(message="la date doit etre au format YYYY-MM-DD")
     * @Assert\NotBlank(message="la date est obligatoire")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255) 
     * @Groups({"invoices_read", "customers_read", "invoices_subresource_read"})
     * @Assert\NotBlank(message="le status de la facture est obligatoire")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message="le status doit etre sent, paid ou cancelled")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="le client de la facture est obligatoire")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource_read"})
     * @Assert\NotBlank(message="le chrono de la facture est obligatoire")
     * @Assert\Type(type="integer", message="le chrono doit etre un entier")
     */
    private $chrono;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus($status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    /**
     * get user
     * @Groups({"invoices_read", "invoices_subresource_read"})
     * @return User
     */
    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
