import type { Config } from '@jest/types'
import * as chalk from 'chalk'

console.log(chalk.blueBright`using jest.config.ts`)

const config: Config.InitialOptions = {
  verbose: false,
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
}

export default config
