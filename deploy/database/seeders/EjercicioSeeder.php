<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EjercicioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (\Illuminate\Support\Facades\Schema::hasTable('ejercicios')) {
            \App\Models\Ejercicio::truncate();
        }
        $ejercicios = [
            [
                'titulo' => 'Alivio Cervical',
                'instrucciones' => '1. Siéntate con espalda recta. 2. Inclina suavemente la oreja hacia el hombro. 3. Sostén 15 segundos y cambia de lado.',
                'beneficio' => 'Libera la tensión acumulada en el cuello por uso de pantallas.',
                'duracion' => 2,
                'imagen' => 'img/ejercicios/cuello.png'
            ],
            [
                'titulo' => 'Protección del Túnel Carpiano',
                'instrucciones' => '1. Extiende el brazo al frente. 2. Lleva la palma hacia atrás con ayuda de la otra mano. 3. Repite moviendo los dedos.',
                'beneficio' => 'Previene lesiones por uso intensivo de teclado y mouse.',
                'duracion' => 1,
                'imagen' => 'img/ejercicios/munecas.png'
            ],
            [
                'titulo' => 'Liberación de Hombros',
                'instrucciones' => '1. Realiza movimientos circulares amplios con los hombros hacia atrás. 2. Inhala al subir, exhala al bajar.',
                'beneficio' => 'Reduce la carga en el trapecio y mejora la postura.',
                'duracion' => 1,
                'imagen' => 'img/ejercicios/hombros.png'
            ],
            [
                'titulo' => 'Gimnasia Visual (20-20-20)',
                'instrucciones' => '1. Desvía la mirada de la pantalla. 2. Enfoca un punto a 6 metros por 20 segundos. 3. Parpadea repetidamente.',
                'beneficio' => 'Reduce la fatiga ocular y previene el síndrome visual informático.',
                'duracion' => 1,
                'imagen' => 'img/ejercicios/ojos.png'
            ],
            [
                'titulo' => 'Descompresión Lumbar',
                'instrucciones' => '1. De pie, coloca las manos en la espalda baja. 2. Realiza una suave extensión hacia atrás. 3. Regresa al centro lentamente.',
                'beneficio' => 'Compensa la presión en los discos intervertebrales por estar sentado.',
                'duracion' => 2,
                'imagen' => 'img/ejercicios/lumbar.png'
            ],
            [
                'titulo' => 'Activación de Retorno Venoso',
                'instrucciones' => '1. Sentado o de pie, levanta los talones quedando en puntas. 2. Baja lentamente. 3. Repite rítmicamente.',
                'beneficio' => 'Mejorar la circulación y previene la inflamación de piernas.',
                'duracion' => 2,
                'imagen' => 'img/ejercicios/tobillos.png'
            ],
            [
                'titulo' => 'Coherencia Respiratoria',
                'instrucciones' => '1. Inhala profundamente por la nariz durante 4 segundos. 2. Mantén 2 segundos. 3. Exhala por la boca en 6 segundos.',
                'beneficio' => 'Regula el sistema nervioso y reduce niveles de cortisol (estrés).',
                'duracion' => 3,
                'imagen' => 'img/ejercicios/respiracion.png'
            ],
            [
                'titulo' => 'Rotación Segmentaria',
                'instrucciones' => '1. Sentado, gira el tronco hacia un lado apoyándote en el respaldo. 2. Mantén la mirada al frente. 15 seg por lado.',
                'beneficio' => 'Mejora la flexibilidad de la columna vertebral.',
                'duracion' => 2,
                'imagen' => 'img/ejercicios/tronco.png'
            ],
            [
                'titulo' => 'Estiramiento de Tríceps',
                'instrucciones' => '1. Eleva un brazo y dobla el codo tras la cabeza. 2. Empuja el codo con la otra mano. Sostén 15 segundos.',
                'beneficio' => 'Libera la tensión en los brazos y la parte alta de la espalda.',
                'duracion' => 1,
                'imagen' => 'img/ejercicios/triceps.png'
            ],
            [
                'titulo' => 'Apertura Lateral de Tronco',
                'instrucciones' => '1. De pie, inclina tu cuerpo hacia un lado deslizando la mano por la pierna. 2. Eleva el brazo opuesto.',
                'beneficio' => 'Estira los intercostales y mejora la capacidad respiratoria.',
                'duracion' => 2,
                'imagen' => 'img/ejercicios/lateral.png'
            ],
            [
                'titulo' => 'Flexibilidad de Cadera',
                'instrucciones' => '1. Siéntate y cruza un pie sobre la rodilla opuesta (forma un 4). 2. Inclina el pecho hacia adelante suavemente.',
                'beneficio' => 'Libera el músculo piramidal y mejora la movilidad de la cadera.',
                'duracion' => 2,
                'imagen' => 'img/ejercicios/piernas.png'
            ],
            [
                'titulo' => 'Movilidad de Antebrazos',
                'instrucciones' => '1. Junta las palmas al centro del pecho (posición rezo). 2. Desciende las manos sin separar las palmas.',
                'beneficio' => 'Estira flexores del antebrazo, vital para trabajadores de oficina.',
                'duracion' => 1,
                'imagen' => 'img/ejercicios/antebrazos.png'
            ]
        ];

        foreach ($ejercicios as $ejercicio) {
            \App\Models\Ejercicio::create($ejercicio);
        }
    }
}
