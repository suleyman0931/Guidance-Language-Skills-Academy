<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotional_images', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('image_url'); // URL or path to the image
            $table->text('description')->nullable();
            $table->integer('display_order')->default(0); // Order in which to display
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotional_images');
    }
};
