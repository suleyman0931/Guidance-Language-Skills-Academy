<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin account
        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'registration_id' => null,
                'username'        => 'admin',
                'name_en'         => 'Suleyman Abdu',
                'name_am'         => 'ሱለይማን አብዱ',
                'phone'           => '0909918195',
                'password'        => Hash::make('Admin@2024!'),
                'role'            => 'admin',
            ]
        );

        // Seed a welcome post
        Post::firstOrCreate(
            ['title_en' => 'Welcome to Guidance Academy!'],
            [
                'title_en'     => 'Welcome to Guidance Academy!',
                'title_am'     => 'እንኳን ወደ ጋይዳንስ አካዴሚ በደህና መጡ!',
                'body_en'      => 'We are excited to offer our Summer English Grammar, Speaking & Presentation Skills course. Register now to secure your spot!',
                'body_am'      => 'የበጋ አንግሊዘኛ ሰዋስው፣ ተናጋሪነት እና አቀራረብ ኮርሳችንን ለማቅረብ ደስተኞች ነን። ቦታዎን ለማረጋገጥ አሁን ይመዝገቡ!',
                'type'         => 'announcement',
                'is_published' => true,
                'created_by'   => 1,
            ]
        );

        Post::firstOrCreate(
            ['title_en' => 'Course starts July 2018 E.C.'],
            [
                'title_en'     => 'Course starts July 01/11/2018 E.C.',
                'title_am'     => 'ኮርሱ ጁላይ 01/11/2018 ዓ.ም. ይጀምራል',
                'body_en'      => 'Classes will be held at Harbu High School. Contact us at 0909918195 or 0915260722 for more information.',
                'body_am'      => 'ክፍሎቹ ሃርቡ ሁለተኛ ደረጃ ት/ቤት ይካሄዳሉ። ለተጨማሪ መረጃ 0909918195 ወይም 0915260722 ያናግሩን።',
                'type'         => 'news',
                'is_published' => true,
                'created_by'   => 1,
            ]
        );
    }
}
