@extends('layout') @section('content')
<div class="actions"><h1 style="margin-right:auto" data-cy="titulo-pagina">Clientes</h1><a class="btn" href="{{ route('clientes.create') }}" data-cy="btn-novo-cliente">+ Novo cliente</a></div>
<div class="table-wrap"><table data-cy="tabela-clientes"><thead><tr><th>Nome</th><th>Contato</th><th>Endereço</th><th>Ações</th></tr></thead><tbody>
@forelse($customers as $customer)
<tr data-cy="linha-cliente" data-id="{{ $customer->id }}">
    <td data-cy="cliente-nome">{{ $customer->name }}</td>
    <td data-cy="cliente-contato">{{ $customer->email }}<br>{{ $customer->phone }}</td>
    <td data-cy="cliente-endereco">{{ $customer->address }}<br>{{ $customer->city }}</td>
    <td class="actions"><a class="btn secondary" href="{{ route('clientes.edit',$customer) }}" data-cy="btn-editar">Editar</a><form method="POST" action="{{ route('clientes.destroy',$customer) }}" onsubmit="return confirm('Remover cliente?')">@csrf @method('DELETE')<button class="danger" data-cy="btn-excluir">Excluir</button></form></td>
</tr>
@empty<tr><td colspan="4" data-cy="tabela-vazia">Nenhum cliente cadastrado.</td></tr>@endforelse
</tbody></table><div data-cy="paginacao">{{ $customers->links() }}</div></div>
@endsection
