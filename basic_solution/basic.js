const print = console.log;
const config = {
  stric_mode: false,
};
function handleInputValidation(any_input) {
  if (typeof any_input !== "string") {
    return { data: null, err: new Error("input must be of type string") };
  }

  const valid_grid_size_regex = new RegExp(/^\d{1,}\s\d{1,}?\s*\r?\n/);
  if (!valid_grid_size_regex.test(any_input)) {
    return {
      data: null,
      err: new Error(
        "grid size not defined proeprly, use one digit or more space digit and one digit or more"
      ),
    };
  }

  const parssed_mown_instruction = any_input
    .split("\n")
    .map((str_line) => str_line.trim());
  const start_pos_regex = new RegExp(/\d{1,}\s\d{1,}\s[N,S,E,W]?/);
  const mown_orders_regex = new RegExp(/[L,F,R]*/);
  const invalid_row = parssed_mown_instruction.findIndex((row, idx) => {
    if (idx === 0) return false;
    return idx % 2 !== 0
      ? !start_pos_regex.test(row) && idx
      : !mown_orders_regex.test(row) && idx;
  });

  if (invalid_row > -1) {
    return {
      data: null,
      err: new Error(
        "input contains invalid start position or instrauction in line: ",
        invalid_row
      ),
    };
  }

  return { data: parssed_mown_instruction, err: null };
}

function solution(data_string) {
  const { data: parssed_mown_instruction, err } =
    handleInputValidation(data_string);
  if (err) {
    throw err;
  }

  //print({ parssed_mown_instruction });
  const grid_definitions = parssed_mown_instruction[0].split(" ");
  const grid_loan_x = grid_definitions[0];
  const grid_loan_y = grid_definitions[1];

  const FORWARD = "F",
    LEFT = "L",
    RIGHT = "R",
    NORTH = "N",
    SOUTH = "S",
    EAST = "E",
    WEST = "W";

  let end_pos_of_mown_strings = [];
  for (
    let row_in_input_string = 1;
    row_in_input_string < parssed_mown_instruction.length;
    row_in_input_string++
  ) {
    const mown_start_loc = parssed_mown_instruction[row_in_input_string];
    row_in_input_string++;
    const mown_instruction = parssed_mown_instruction[row_in_input_string];
    /** @type {{ x, y, dir }} */
    const end_point = calcMownMove(
      mown_start_loc,
      mown_instruction,
      grid_loan_x,
      grid_loan_y
    );
    let end_point_as_string =
      end_point.x + " " + end_point.y + " " + end_point.dir + "\n";
    end_pos_of_mown_strings.push(end_point_as_string);
  }
  return end_pos_of_mown_strings;

  function calcMownMove(start, instructions, grid_x, grid_y) {
    const [start_x, start_y, start_dir] = start.split(" ");
    if (start_x > grid_x || start_y > grid_y) {
      if (config.stric_mode) {
        throw Error("mown out of loan grid in start position");
      } else {
        // @note: no movment, just return
        return { x: start_x, y: start_y };
      }
    }

    let curr_x = start_x,
      curr_y = start_y,
      curr_dir = start_dir;
    for (let order of instructions.split("")) {
      if (
        order === FORWARD &&
        isInsideGridAreaAfterMovement(grid_x, grid_y, curr_x, curr_y)
      ) {
        const { x, y } = calcMovmentByDirection(curr_x, curr_y, curr_dir);
        curr_x = x;
        curr_y = y;
      } else if (order !== FORWARD) {
        curr_dir = calcNextDirByLeftAndRight(order, curr_dir);
      }
    }

    return { x: curr_x, y: curr_y, dir: curr_dir };
  }

  function isInsideGridArea(max_x, max_y, x, y) {
    return x <= max_x && y <= max_y && x >= 0 && y >= 0;
  }

  function calcMovmentByDirection(x, y, dir) {
    switch (dir) {
      case NORTH:
        y = +y + 1;
        break;
      case SOUTH:
        y = +y - 1;
        break;
      case EAST:
        x = +x + 1;
        break;
      case WEST:
        x = +x - 1;
        break;
    }

    return { x, y };
  }

  function isInsideGridAreaAfterMovement(max_x, max_y, curr_x, curr_y, dir) {
    const { x, y } = calcMovmentByDirection(curr_x, curr_y, dir);

    return isInsideGridArea(max_x, max_y, x, y);
  }

  function calcNextDirByLeftAndRight(left_or_right, curr_dir) {
    let new_dir;
    switch (curr_dir) {
      case NORTH:
        new_dir = left_or_right === LEFT ? WEST : EAST;
        break;
      case SOUTH:
        new_dir = left_or_right === LEFT ? EAST : WEST;
        break;
      case EAST:
        new_dir = left_or_right === LEFT ? NORTH : SOUTH;
        break;
      case WEST:
        new_dir = left_or_right === LEFT ? SOUTH : NORTH;
        break;
    }
    return new_dir;
  }
}

function main() {
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
      expected: "",
      debug: {},
    },
    {
      n: `a5 5 
          3 3 E 
          FFRFFRFRRF`,
      expected: "",
      debug: {},
    },
  ];

  print(":::::::::::::::::::::::");
  let is_not_failed = true,
    test_idx = 0;
  for (test of tests) {
    test_idx++;
    print("======\n");
    print(test.n);
    let result;
    try {
      result = solution(test.n);
    } catch (err) {
      result = err.message;
    }
    print("result: " + result);
    print("\n");

    if (test.expected && !Array.isArray(result) && result !== test.expected) {
      is_not_failed = false;
      console.error("expected " + test.expected + " test failed !! \n =====");
    } else if (Array.isArray(result) && Array.isArray(test.expected)) {
      const not_match_res_idx = result.findIndex((item, idx) =>
        typeof item === "string"
          ? item.trim() !== test.expected[idx].trim()
          : item !== test.expected[idx]
      );
      if (not_match_res_idx > -1) {
        is_not_failed = false;
        console.error(
          "TEST " +
            test_idx +
            " FAIL " +
            "expected " +
            test.expected[not_match_res_idx] +
            " and got " +
            result[not_match_res_idx] +
            " test failed !! \n ====="
        );
      }
    } else if (result && test.expected && !result.instanceof(new Error())) {
      is_not_failed = false;
      console.error(
        "TEST " +
          test_idx +
          " FAIL " +
          "expected type " +
          typeof test.expected +
          " and result type not match /n " +
          "test failed !! \n ====="
      );
    } else if (result && test.expected) {
      is_not_failed = false;
      console.error(
        "TEST " +
          test_idx +
          " FAIL " +
          "expected null " +
          " and got " +
          typeof result +
          " in result/n " +
          "\n ====="
      );
    }
    console.info("TEST " + test_idx + " SUCCESS");
  }
  if (is_not_failed) {
    print(":::::::::::::::::::::::");
    console.info("SUCCESS - ALL TESTS PASSED");
    print(":::::::::::::::::::::::");
  }
}

main();
