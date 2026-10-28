@extends('layout') @section('content')
<div class="actions"><h1 style="margin-right:auto" data-cy="titulo-pagina">Fretes e entregas</h1><a class="btn" href="{{ route('entregas.create') }}" data-cy="btn-nova-entrega">+ Nova entrega</a></div>
<div class="table-wrap"><table data-cy="tabela-entregas"><thead><tr><th>Pedido</th><th>Cliente</th><th>Destino</th><th>Frete</th><th>Data</th><th>Status</th><th>Rastreio</th><th>Ações</th></tr></thead><tbody>
@forelse($deliveries as $delivery)
<tr data-cy="linha-entrega" data-id="{{ $delivery->id }}" data-pedido="{{ $delivery->order_id }}">
    <td data-cy="entrega-pedido">#{{ $delivery->order_id }}</td>
    <td data-cy="entrega-cliente">{{ $delivery->order->customer->name }}</td>
    <td data-cy="entrega-destino">{{ $delivery->address }}, {{ $delivery->city }}</td>
    <td data-cy="entrega-taxa">R$ {{ number_format($delivery->fee,2,',','.') }}</td>
    <td data-cy="entrega-data">{{ $delivery->scheduled_at?->format('d/m/Y') }}</td>
    <td><small class="badge" data-cy="entrega-status">{{ $delivery->status }}</small></td>
    <td data-cy="entrega-rastreio">{{ $delivery->tracking_code }}</td>
    <td class="actions"><a class="btn secondary" href="{{ route('entregas.edit',$delivery) }}" data-cy="btn-editar">Editar</a><form method="POST" action="{{ route('entregas.destroy',$delivery) }}" onsubmit="return confirm('Remover entrega?')">@csrf @method('DELETE')<button class="danger" data-cy="btn-excluir">Excluir</button></form></td>
</tr>
@empty<tr><td colspan="8" data-cy="tabela-vazia">Nenhuma entrega cadastrada.</td></tr>@endforelse
</tbody></table><div data-cy="paginacao">{{ $deliveries->links() }}</div></div>
@endsection
