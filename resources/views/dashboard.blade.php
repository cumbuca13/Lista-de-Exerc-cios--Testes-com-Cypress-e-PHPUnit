@extends('layout')
@section('content')
<h1 data-cy="titulo-pagina">Painel da confeitaria</h1><p>Explore os cadastros, listas, selects e regras de estoque.</p>
<div class="cards">
@foreach([['Produtos em estoque',$products,'produtos.index','produtos'],['Clientes',$customers,'clientes.index','clientes'],['Pedidos',$orders,'pedidos.index','pedidos'],['Entregas',$deliveries,'entregas.index','entregas']] as [$label,$value,$route,$key])
<a class="card" href="{{ route($route) }}" style="text-decoration:none;color:inherit" data-cy="card-{{ $key }}"><div>{{ $label }}</div><b>{{ $value }}</b></a>
@endforeach
</div>
<div class="card"><h2>Fluxo sugerido para os testes</h2><ol><li>Cadastre produtos e defina o estoque mínimo.</li><li>Cadastre clientes.</li><li>Crie um pedido: o preço vem do produto e o estoque é baixado.</li><li>Agende uma entrega e altere seu status.</li></ol></div>
@endsection
