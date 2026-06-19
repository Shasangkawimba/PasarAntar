<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class OrderSettleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $order = $this->route('order');
        return $order && $this->user()->can('settle', $order);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $order = $this->route('order');
        $hasReceipt = $order ? $order->receipts()->exists() : false;

        return [
            'actual_amount' => ['required', 'integer', 'min:0'],
            'receipt' => [
                $hasReceipt ? 'nullable' : 'required',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:5120', // 5MB max
            ],
        ];
    }

    /**
     * Custom messages for validation.
     */
    public function messages(): array
    {
        return [
            'actual_amount.required' => 'Total belanja riil wajib diisi.',
            'actual_amount.integer' => 'Total belanja riil harus berupa angka.',
            'actual_amount.min' => 'Total belanja riil tidak boleh kurang dari 0.',
            'receipt.required' => 'Foto nota belanja wajib diunggah.',
            'receipt.image' => 'File harus berupa gambar.',
            'receipt.mimes' => 'Format gambar harus jpeg, png, jpg, atau gif.',
            'receipt.max' => 'Ukuran gambar maksimal adalah 5MB.',
        ];
    }
}
