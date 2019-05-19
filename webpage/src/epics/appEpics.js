import { map } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { push } from 'connected-react-router'

//Once the game state has been reset return to the root path.
export const appResetEpic = action$ =>
	action$.pipe(
		ofType('RESET_APP'),
		map(() => push('/'))
	)
