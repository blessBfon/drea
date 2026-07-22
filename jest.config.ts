import type {Config} from 'jest'

const config:Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment:'node',//use 'jsdom' if we ware testing vuecomponents
  moduleFileExtensions:['ts','js'],
  "roots":['<rootDir>/src'],
  testMatch:['<rootDir>/src/**/*.tests.ts'],
  extensionsToTreatAsEsm:['.ts'],
  transform:{
    '^.+\\.ts$':['ts-jest',{
      useESM:true,
      isolatedModules:true
    }]
  },
    moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  }
}

export default config