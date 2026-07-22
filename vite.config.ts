import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
    plugins:[
        dts({
            insertTypesEntry: true, // Auto adds "types" to package.json
            include:['src'],
            exclude:["**/*.test.ts"],
            tsconfigPath:'./tsconfig.json'
        })
    ],
    build:{
        outDir:'dist',
        lib:{
            entry:resolve(__dirname,'src/index.ts'), // Our entry file
            name :'drea',
            fileName: (format)=> `index.${format=='es'?'js':'cjs'}`,
            formats:['es','cjs']
        },
        rollupOptions:{
            external: ['vue', 'react', 'lodash'],
            output:{
                globals:{
                    vue: 'Vue',
                    react: ' Reac-t'
                }
            }
        }
    }
})