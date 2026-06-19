<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Receipt;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ReceiptUploadService
{
    /**
     * Upload a receipt for an order.
     *
     * @param User $joki
     * @param Order $order
     * @param UploadedFile $file
     * @return Receipt
     *
     * @throws ValidationException
     */
    public function upload(User $joki, Order $order, UploadedFile $file): Receipt
    {
        // Ownership validation
        if ($order->assigned_joki_id !== $joki->id) {
            throw ValidationException::withMessages([
                'order_id' => 'Anda tidak memiliki wewenang untuk mengunggah nota untuk pesanan ini.',
            ]);
        }

        // Status validation: Receipt only allowed during SHOPPING or DELIVERING
        if (! in_array($order->status, ['SHOPPING', 'DELIVERING'])) {
            throw ValidationException::withMessages([
                'status' => 'Nota hanya dapat diunggah saat status pesanan SHOPPING atau DELIVERING.',
            ]);
        }

        // Store file in the 'receipts' folder on the 'public' disk
        $path = $file->store('receipts', 'public');
        $imageUrl = Storage::url($path);

        return DB::transaction(function () use ($order, $imageUrl, $joki) {
            $receipt = Receipt::create([
                'order_id' => $order->id,
                'image_url' => $imageUrl,
                'uploaded_by' => $joki->id,
            ]);

            ActivityLog::create([
                'user_id' => $joki->id,
                'action' => 'RECEIPT_UPLOADED',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'receipt_id' => $receipt->id,
                    'image_url' => $imageUrl,
                ],
            ]);

            return $receipt;
        });
    }
}
