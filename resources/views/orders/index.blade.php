@extends('layout') @section('content')
<div class="actions"><h1 style="margin-right:auto" data-cy="titulo-pagina">Pedidos / vendas</h1><a class="btn" href="{{ route('pedidos.create') }}" data-cy="btn-novo-pedido">+ Novo pedido</a></div>
<div class="table-wrap"><table data-cy="tabela-pedidos"><thead><tr><th>#</th><th>Cliente</th><th>Produto</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead><tbody>
@forelse($orders as $order)
<tr data-cy="linha-pedido" data-id="{{ $order->id }}">
    <td data-cy="pedido-id">{{ $order->id }}</td>
    <td data-cy="pedido-cliente">{{ $order->customer->name }}</td>
    <td data-cy="pedido-produto">{{ $order->product->name }} ({{ $order->quantity }})</td>
    <td data-cy="pedido-total">R$ {{ number_format($order->total,2,',','.') }}</td>
    <td><small class="badge" data-cy="pedido-status">{{ $order->status }}</small></td>
    <td class="actions"><a class="btn secondary" href="{{ route('pedidos.edit',$order) }}" data-cy="btn-editar">Editar</a><form method="POST" action="{{ route('pedidos.destroy',$order) }}" onsubmit="return confirm('Remover pedido?')">@csrf @method('DELETE')<button class="danger" data-cy="btn-excluir">Excluir</button></form></td>
</tr>
@empty<tr><td colspan="6" data-cy="tabela-vazia">Nenhum pedido cadastrado.</td></tr>@endforelse
</tbody></table><div data-cy="paginacao">{{ $orders->links() }}</div></div>
@endsection
