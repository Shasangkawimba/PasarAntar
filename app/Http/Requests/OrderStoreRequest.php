<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isBuyer();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'market_id' => ['required', 'integer', 'exists:markets,id'],
            'estimated_amount' => ['required', 'integer', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_name' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'market_id.required' => 'Pasar wajib dipilih.',
            'market_id.exists' => 'Pasar terpilih tidak valid.',
            'estimated_amount.required' => 'Estimasi biaya wajib diisi.',
            'estimated_amount.min' => 'Estimasi biaya tidak boleh kurang dari 0.',
            'items.required' => 'Daftar barang belanjaan wajib diisi.',
            'items.min' => 'Minimal harus menambahkan 1 barang belanjaan.',
            'items.*.product_name.required' => 'Nama barang wajib diisi.',
            'items.*.quantity.required' => 'Jumlah barang wajib diisi.',
            'items.*.quantity.min' => 'Jumlah barang minimal harus 1.',
        ];
    }
}
