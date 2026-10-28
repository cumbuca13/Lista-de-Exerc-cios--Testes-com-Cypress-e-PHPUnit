@csrf
<label>Nome<input name="name" value="{{ old('name',$customer->name ?? '') }}" required data-cy="campo-nome">@error('name')<span class="error" data-cy="erro-nome">{{ $message }}</span>@enderror</label>
<label>E-mail<input type="email" name="email" value="{{ old('email',$customer->email ?? '') }}" data-cy="campo-email">@error('email')<span class="error" data-cy="erro-email">{{ $message }}</span>@enderror</label>
<label>Telefone<input name="phone" value="{{ old('phone',$customer->phone ?? '') }}" data-cy="campo-telefone">@error('phone')<span class="error" data-cy="erro-telefone">{{ $message }}</span>@enderror</label>
<label>Endereço<input name="address" value="{{ old('address',$customer->address ?? '') }}" data-cy="campo-endereco">@error('address')<span class="error" data-cy="erro-endereco">{{ $message }}</span>@enderror</label>
<label>Cidade<input name="city" value="{{ old('city',$customer->city ?? '') }}" data-cy="campo-cidade">@error('city')<span class="error" data-cy="erro-cidade">{{ $message }}</span>@enderror</label>
<div class="actions"><button data-cy="btn-salvar">Salvar</button><a class="btn secondary" href="{{ route('clientes.index') }}" data-cy="btn-cancelar">Cancelar</a></div>
