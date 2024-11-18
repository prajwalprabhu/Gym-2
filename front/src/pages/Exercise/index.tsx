import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import {
  ExerciseDetailsService,
  ExercisesService,
  MuscleGroupsService,
  MusclesService,
} from '../../client/services.gen';
import {
  ExercisedetailsModel,
  ExercisesFetchAllResponse,
  ExerciseDetailsFetchAllResponse,
  MuscleGroupsFetchAllResponse,
  MusclesFetchAllResponse,
  ExerciseDetailsFetchSetDetailsResponse,
  ExercisesFetchNextSetResponse,
} from '../../client/types.gen';
import { useEvent } from '../../utils/hooks';
function Exercise() {
  const [muscle_groups, setMuscle_groups] =
    useState<MuscleGroupsFetchAllResponse>([]);
  const [muscles, setMuscles] = useState<MusclesFetchAllResponse>([]);
  const [muscle_exercises, setMuscle_exercises] =
    useState<ExercisesFetchAllResponse>([]);
  const [exercises, setExercises] = useState<ExerciseDetailsFetchAllResponse>(
    []
  );

  const [performedExercises, setPerformedExercises] =
    useState<ExercisedetailsModel>({
      user_id: 0,
      exercise_id: 0,
      exercise_details_id: 0,
      sets: [],
    });
  useEffect(() => {
    if (
      performedExercises.sets.length > 0 &&
      performedExercises.user_id > 0 &&
      performedExercises.exercise_id > 0
    ) {
      // newSet.mutate(performedExercises);
      ExerciseDetailsService.detailsInsert({
        body: performedExercises,
      })
        .then((data) => data.data)
        .then((exercise_details_id) => {
          console.log(exercise_details_id, 'ed_id');
          setPerformedExercises((curr) => ({
            ...curr,
            exercise_details_id: exercise_details_id || 0,
          }));
        });

      //   exercises.refetch();
    }
  }, [performedExercises.sets]);
  useEffect(() => {
    if (performedExercises.exercise_id > 0) {
      ExercisesService.fetchNextSet({
        query: {
          exercise_id: performedExercises.exercise_id,
          user_id: performedExercises.user_id,
        },
      }).then((data) => setNew_sets(data.data || []));
    }
  }, [performedExercises.exercise_id]);

  const [queryParams, setQueryParams] = useState({
    user_id: 1,
  });

  const [selectedExercise, setSelectedExercise] = useState({
    user_id: 0,
    exercise_id: 0,
    exercise_details_id: 0,
  });
  useEffect(() => {
    console.log(selectedExercise.exercise_details_id);
    if (selectedExercise.exercise_details_id > 0) {
      const fetch = async () => {
        let data = await ExerciseDetailsService.detailsFetchSetDetails({
          query: {
            user_id: queryParams.user_id,
            exercise_details_id: selectedExercise.exercise_details_id,
            exercise_id: selectedExercise.exercise_id,
          },
        });
        setSetDetail(data.data || []);
      };
      fetch();
    }
  }, [selectedExercise]);

  const [setDetail, setSetDetail] =
    useState<ExerciseDetailsFetchSetDetailsResponse>([]);
  useEffect(() => {
    if (selectedExercise.exercise_id > 0) {
      modelOpenButton.current?.setAttribute(
        'data-bs-target',
        '#setDetailsModal'
      );
      modelOpenButton.current?.click();
    }
  }, [setDetail]);

  const [new_sets, setNew_sets] = useState<ExercisesFetchNextSetResponse>([]);

  useEffect(() => {
    if (new_sets && new_sets.length > 0) {
      setPerformedExercises((curr) => ({
        ...curr,
        sets: new_sets || [],
      }));
    }
  }, [new_sets]);

  const [selectedMuscleGroup, setselectedMuscleGroup] = useState({
    muscle_group_id: 0,
  });
  useEffect(() => {
    if (selectedMuscleGroup.muscle_group_id > 0) {
      MusclesService.fetchAll({
        query: {
          muscle_group_id: selectedMuscleGroup.muscle_group_id,
        },
      }).then((data) => {
        setMuscles(data.data || []);
      });
    }
  }, [selectedMuscleGroup]);
  const [selectedMuscle, setselectedMuscle] = useState({
    muscle_id: 0,
  });
  useEffect(() => {
    if (selectedMuscle.muscle_id <= 0) {
      return;
    }
    ExercisesService.fetchAll({
      query: {
        muscle_group_id: selectedMuscleGroup.muscle_group_id,
        muscle_id: selectedMuscle.muscle_id,
      },
    }).then((data) => {
      setMuscle_exercises(data.data || []);
    });
  }, [selectedMuscle]);

  const modelOpenButton = useRef<HTMLButtonElement>(null);
  const repsRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);
  const setDetailsModal = useRef<HTMLDivElement>(null);
  const newWorkOutModal = useRef<HTMLDivElement>(null);
  let setDetailsModalCloseHandler = useCallback(() => {
    setSelectedExercise({
      user_id: 0,
      exercise_id: 0,
      exercise_details_id: 0,
    });
  }, [])
  let newWorkOutModalCloseHandler = useCallback(() => {
    setselectedMuscleGroup({ muscle_group_id: 0 });
    setselectedMuscle({ muscle_id: 0 });
    setPerformedExercises({
      user_id: queryParams.user_id,
      exercise_id: 0,
      exercise_details_id: 0,
      sets: [],
    });

  }, [])

  const [addSetDetailsHide, removeSetDetailsHide] = useEvent('hidden.bs.modal', setDetailsModalCloseHandler);
  const [addNewWorkOutHide, removeNewWorkOutHide] = useEvent('hidden.bs.modal', newWorkOutModalCloseHandler);
  useEffect(() => {
    console.log('useEffect');
    addSetDetailsHide(setDetailsModal.current)
    addNewWorkOutHide(newWorkOutModal.current)
    const fetchData = async () => {
      let exercises = await ExerciseDetailsService.detailsFetchAll({
        query: {
          user_id: queryParams.user_id,
        },
      });

      setExercises(exercises.data || []);

      let muscleGroups = await MuscleGroupsService.groupsFetchAll();

      setMuscle_groups(muscleGroups.data || []);
    };
    fetchData();
    return () => {
      removeSetDetailsHide(setDetailsModal.current)
      removeNewWorkOutHide(newWorkOutModal.current)
    }
  }, []);
  return (
    <div className="row">
      <button
        type="button"
        tabIndex={-1}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        ref={modelOpenButton}>
        Set Details
      </button>
      <div
        className="modal fade"
        id="setDetailsModal"
        ref={setDetailsModal}
        tabIndex={-1}
        aria-labelledby="setDetailsModalLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id="setDetailsModalLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* {setDetail.data &&
                setDetail.data.suggest_drop &&
                toast('Suggest Drop')} */}
              <table className="table table-stripped">
                <thead>
                  <tr>
                    <th scope="col">Set Number</th>
                    <th scope="col">Reps</th>
                    <th scope="col">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {setDetail.map((set, i) => (
                    <tr key={i}>
                      <td>{set.set_number}</td>
                      <td>{set.reps}</td>
                      <td>{set.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal">
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-2 ">
          <button
            className="btn btn-primary"
            onClick={(_) => {
              modelOpenButton.current?.setAttribute(
                'data-bs-target',
                '#newWorkOutModal'
              );
              modelOpenButton.current?.click();
            }}>
            Add new workout
          </button>
        </div>
      </div>
      <table className=" table table-bordered border-primary table-primary m-5 rounded">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Muscle Group Name</th>
            <th scope="col">Muscle Name</th>
            <th scope="col">Exercise Name</th>
            <th scope="col">Performed Date</th>
            <th scope="col">Set Details</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise, i) => (
            <tr key={i}>
              <td>{exercise.exercise_details_id}</td>
              <td>{exercise.muscle_group_name}</td>
              <td>{exercise.muscle_name}</td>
              <td>{exercise.exercise_name}</td>
              <td>{exercise.performed_date}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={(e) => {
                    setSelectedExercise({
                      user_id: exercise.user_id,
                      exercise_id: exercise.exercise_id,
                      exercise_details_id: exercise.exercise_details_id,
                    });
                  }}>
                  Set Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="modal modal-lg fade"
        id="newWorkOutModal"
        ref={newWorkOutModal}
        tabIndex={-1}
        aria-labelledby="newWorkOutModalLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id="newWorkOutModalLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form action="">
                <div className="row">
                  <div className="col-3 m-3">
                    <label
                      htmlFor="muscle_group"
                      className="form-label">
                      Muscle Group
                    </label>
                    <select
                      className="form-select"
                      aria-label="Muscle Group"
                      id="muscle_group"
                      value={selectedMuscleGroup.muscle_group_id}
                      onInput={(e) => {
                        console.log(e.currentTarget.value);
                        setselectedMuscleGroup({
                          muscle_group_id: parseInt(e.currentTarget.value, 10),
                        });
                      }}>
                      <option
                        value="0"
                        key={0}
                        selected>
                        Select Muscle Group
                      </option>
                      {muscle_groups.map((muscle_group, i) => (
                        <option
                          key={i}
                          value={muscle_group.muscle_group_id}>
                          {muscle_group.muscle_group_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-3 m-3">
                    <label
                      htmlFor="muscle"
                      className="form-label">
                      Muscle
                    </label>
                    <select
                      className="form-select"
                      aria-label="Muscle "
                      id="muscle"
                      value={selectedMuscle.muscle_id}
                      onInput={(e) => {
                        setselectedMuscle({
                          muscle_id: parseInt(e.currentTarget.value, 10),
                        });
                      }}>
                      <option
                        value="0"
                        key={0}>
                        Select Muscle
                      </option>
                      {muscles.map((muscle) => (
                        <option
                          key={muscle.muscle_id}
                          value={muscle.muscle_id}>
                          {muscle.muscle_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-3 m-3">
                    <label
                      htmlFor="exercise"
                      className="form-label">
                      Exercise
                    </label>
                    <select
                      className="form-select"
                      aria-label="Muscle Group"
                      id="exercise"
                      value={performedExercises.exercise_id}
                      onInput={(e) => {
                        if (
                          performedExercises.exercise_id ||
                          performedExercises.exercise_id != 0
                        ) {
                          if (
                            confirm(
                              'Are you sure you want to change the exercise (This will erase ur set details)?'
                            )
                          ) {
                            setPerformedExercises({
                              exercise_id: parseInt(e.currentTarget.value, 10),
                              exercise_details_id: 0,
                              user_id: 1,
                              sets: [],
                            });
                            return;
                          } else {
                            return;
                          }
                        }
                        setPerformedExercises({
                          exercise_id: parseInt(e.currentTarget.value, 10),
                          exercise_details_id: 0,
                          user_id: 1,
                          sets: [],
                        });
                      }}>
                      <option value="0">Select Exercise</option>
                      {muscle_exercises.map((exercise) => (
                        <option
                          key={exercise.exercise_id}
                          value={exercise.exercise_id}>
                          {exercise.exercise_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-3 m-3">
                    <label
                      htmlFor="rep"
                      className="form-label">
                      Reps
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="rep"
                      ref={repsRef}
                    />
                  </div>
                  <div className="col-3 m-3">
                    <label
                      htmlFor="weight"
                      className="form-label">
                      Weight
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="weight"
                      step={2.5}
                      ref={weightRef}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6"></div>
                  <div className="col-3">
                    <button
                      className="btn btn-primary mb-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (repsRef.current && weightRef.current) {
                          let reps = parseInt(repsRef.current.value, 10) || 0;
                          let weight =
                            parseInt(weightRef.current.value, 10) || 0;
                          if (reps <= 0 || weight <= 0) {
                            alert('Reps and Weight must be greater than 0');
                            return;
                          }
                          setPerformedExercises((curr) => ({
                            ...curr,
                            sets: [
                              ...curr.sets,
                              {
                                set_number: curr.sets.length + 1,
                                reps,
                                weight,
                              },
                            ],
                          }));
                        }
                      }}>
                      Add a Set
                    </button>
                  </div>
                </div>
                {/* <div className="row">
                  {JSON.stringify(performedExercises, null, 2)}
                </div> */}
                <table className="table table-bordered table-primary">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th>Muscle Group</th>
                      <th>Muscle</th>
                      <th>Exercise</th>
                      <th scope="col">Reps</th>
                      <th scope="col">Weight</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {performedExercises.sets.map((set, index) => (
                      <tr key={index}>
                        <th scope="row">{set.set_number}</th>
                        <td>
                          {
                            muscle_groups.find(
                              (m) =>
                                m.muscle_group_id ===
                                selectedMuscleGroup.muscle_group_id
                            )?.muscle_group_name
                          }
                        </td>
                        <td>
                          {
                            muscles.find(
                              (m) => m.muscle_id === selectedMuscle.muscle_id
                            )?.muscle_name
                          }
                        </td>
                        <td>
                          {
                            muscle_exercises.find(
                              (m) =>
                                m.exercise_id === performedExercises.exercise_id
                            )?.exercise_name
                          }
                        </td>
                        <td
                          onDblClick={(e) => {
                            e.currentTarget.contentEditable =
                              e.currentTarget.contentEditable == 'true'
                                ? 'false'
                                : 'true';
                            e.currentTarget.focus();
                          }}
                          onBlur={(e) => {
                            if (e.currentTarget.contentEditable == 'true') {
                              e.currentTarget.contentEditable = 'false';
                            }
                            let value =
                              parseFloat(e.currentTarget.innerText) || 0;
                            setPerformedExercises((curr) => ({
                              ...curr,
                              sets: curr.sets.map((s) => {
                                if (s.set_number == set.set_number) {
                                  s.reps = value;
                                }
                                return s;
                              }),
                            }));
                          }}>
                          {set.reps}
                        </td>
                        <td
                          onDblClick={(e) => {
                            e.currentTarget.contentEditable =
                              e.currentTarget.contentEditable == 'true'
                                ? 'false'
                                : 'true';
                            e.currentTarget.focus();
                          }}
                          onBlur={(e) => {
                            if (e.currentTarget.contentEditable == 'true') {
                              e.currentTarget.contentEditable = 'false';
                            }
                            let value =
                              parseFloat(e.currentTarget.innerText) || 0;
                            setPerformedExercises((curr) => ({
                              ...curr,
                              sets: curr.sets.map((s) => {
                                if (s.set_number == set.set_number) {
                                  s.weight = value;
                                }
                                return s;
                              }),
                            }));
                          }}>
                          {set.weight}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => {
                              e.preventDefault();
                              setPerformedExercises((curr) => {
                                return {
                                  ...curr,
                                  sets: curr.sets.filter(
                                    (s) => s.set_number != set.set_number
                                  ),
                                };
                              });
                            }}>
                            Remove Set
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal">
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exercise;
