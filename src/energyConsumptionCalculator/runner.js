import { ArgumentParser } from 'argparse';
import {calculateForDaysBack} from './energyConsumptionCalculator.js';

// Create a new argument parser
const parser = new ArgumentParser()

// Add arguments to be parsed
parser.add_argument('-d', '--days', {
  help: 'Days back',
  required: true
});

// Add arguments to be parsed
parser.add_argument('-t', '--type', {
  help: 'Calculation type',
  choices: ['daily', 'monthly'],
  required: true
});

// Parse command line arguments
const args = parser.parse_args();

// Access parsed arguments
console.log('Arguments:', args);

const main = async function() {

    switch (args.type) {
        case 'daily':
            calculateForDaysBack(args.days);
            break;
    }        

}

main();