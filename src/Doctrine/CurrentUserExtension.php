<?php
// api/src/Doctrine/CurrentUserExtension.php

namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;

final class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        $this->addWhere($queryBuilder, $resourceClass);
        //dd($queryBuilder);
    }
    
    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder, $resourceClass);
        //dd($queryBuilder);
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass): void
    {
        $user = $this->security->getUser();

        if (
            (Invoice::class !== $resourceClass && Customer::class !== $resourceClass) 
            ||
            $this->security->isGranted('ROLE_ADMIN') 
            || 
            null === $user
            )
        {
            return;
        }

        

        $rootAlias = $queryBuilder->getAllAliases()[0];
        if(Customer::class === $resourceClass)
        {
            $queryBuilder->andWhere($rootAlias . '.user = :user');
        }
        else if(Invoice::class === $resourceClass)
        {
            $queryBuilder->join($rootAlias . '.customer','c')
                         ->andWhere('c.user = :user');
        }
        $queryBuilder->setParameter('user', $user);
    }
}