import main from '../index'

function tests() {
    const tests = [
        {
            n: `5 5 
          1 2 N 
          LFLFLFLFF 
          3 3 E 
          FFRFFRFRRF`,
            expected: [`1 3 N`, `5 1 E`],
            debug: {},
        },
        {
            n: `5 5 
          A 3 E 
          FFRFFRFRRF`,
            expected: '',
            debug: {},
        },
        {
            n: `a5 5 
          3 3 E 
          FFRFFRFRRF`,
            expected: '',
            debug: {},
        },
    ]

    print(':::::::::::::::::::::::')
    let is_not_failed = true,
        test_idx = 0
    for (test of tests) {
        test_idx++
        print('======\n')
        print(test.n)
        let result
        try {
            result = main(test.n)
        } catch (err) {
            result = err.message
        }
        print('result: ' + result)
        print('\n')

        if (
            test.expected &&
            !Array.isArray(result) &&
            result !== test.expected
        ) {
            is_not_failed = false
            console.error(
                'expected ' + test.expected + ' test failed !! \n ====='
            )
        } else if (Array.isArray(result) && Array.isArray(test.expected)) {
            const not_match_res_idx = result.findIndex((item, idx) =>
                typeof item === 'string'
                    ? item.trim() !== test.expected[idx].trim()
                    : item !== test.expected[idx]
            )
            if (not_match_res_idx > -1) {
                is_not_failed = false
                console.error(
                    'TEST ' +
                        test_idx +
                        ' FAIL ' +
                        'expected ' +
                        test.expected[not_match_res_idx] +
                        ' and got ' +
                        result[not_match_res_idx] +
                        ' test failed !! \n ====='
                )
            }
        } else if (result && test.expected && !result.instanceof(new Error())) {
            is_not_failed = false
            console.error(
                'TEST ' +
                    test_idx +
                    ' FAIL ' +
                    'expected type ' +
                    typeof test.expected +
                    ' and result type not match /n ' +
                    'test failed !! \n ====='
            )
        } else if (result && test.expected) {
            is_not_failed = false
            console.error(
                'TEST ' +
                    test_idx +
                    ' FAIL ' +
                    'expected null ' +
                    ' and got ' +
                    typeof result +
                    ' in result/n ' +
                    '\n ====='
            )
        }
        console.info('TEST ' + test_idx + ' SUCCESS')
    }
    if (is_not_failed) {
        print(':::::::::::::::::::::::')
        console.info('SUCCESS - ALL TESTS PASSED')
        print(':::::::::::::::::::::::')
    }
}

tests()
