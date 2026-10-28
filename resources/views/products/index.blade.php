@extends('layout') @section('content')
<div class="actions"><h1 style="margin-right:auto" data-cy="titulo-pagina">Produtos e estoque</h1><a class="btn" href="{{ route('produtos.create') }}" data-cy="btn-novo-produto">+ Novo produto</a></div>
<div class="table-wrap"><table data-cy="tabela-produtos"><thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr></thead><tbody>
@forelse($products as $product)
@php($estoqueBaixo = $product->stock <= $product->minimum_stock)
<tr data-cy="linha-produto" data-id="{{ $product->id }}">
    <td><strong data-cy="produto-nome">{{ $product->name }}</strong><br><small>{{ $product->active ? 'Ativo' : 'Inativo' }}</small></td>
    <td data-cy="produto-categoria">{{ $product->category }}</td>
    <td data-cy="produto-preco">R$ {{ number_format($product->price,2,',','.') }}</td>
    <td><small class="badge{{ $estoqueBaixo ? ' estoque-baixo' : '' }}" data-cy="produto-estoque" data-estoque="{{ $product->stock }}">{{ $product->stock }} un.</small>@if($estoqueBaixo) <small class="badge estoque-baixo" data-cy="alerta-estoque-baixo">⚠ Estoque baixo</small>@endif</td>
    <td class="actions"><a class="btn secondary" href="{{ route('produtos.edit',$product) }}" data-cy="btn-editar">Editar</a><form method="POST" action="{{ route('produtos.destroy',$product) }}" onsubmit="return confirm('Remover produto?')">@csrf @method('DELETE')<button class="danger" data-cy="btn-excluir">Excluir</button></form></td>
</tr>
@empty<tr><td colspan="5" data-cy="tabela-vazia">Nenhum produto cadastrado.</td></tr>@endforelse
</tbody></table><div data-cy="paginacao">{{ $products->links() }}</div></div>
@endsection
