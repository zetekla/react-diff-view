import {PureComponent, Fragment} from 'react';
import uniqueId from 'lodash/uniqueId';
import sha from 'sha1';
import {parseDiff} from 'react-diff-view';
import {formatLines, diffLines} from 'unidiff';
import {establishConfiguration} from '../../regions';
import {DiffView, Configuration} from '../../containers';
import InputArea from '../InputArea';
import styles from './index.css';

const fakeIndex = () => sha(uniqueId()).slice(0, 9);
/*
const data = {
    'diff': formatLines(diffLines('The Way that can be told of is not the eternal Way', 'The Way that can be told of is NOT the eternal Way'), {context: 3}),
    'source': 'The Way that can be told of is not the eternal Way'
};
*/

class App extends PureComponent {

    state = {
      'diff': formatLines(diffLines('The Way that can be told of is not the eternal Way', 'The Way that can be told of is NOT the eternal Way'), {context: 3}),
      'source': 'The Way that can be told of is not the eternal Way'
    };

    parse = diff => {
        if (!diff) {
            return null;
        }

        const segments = [
            'diff --git a/a b/b',
            `index ${fakeIndex()}..${fakeIndex()} 100644`,
            diff
        ];

        const files = parseDiff(segments.join('\n'), {nearbySequences: 'zip'});

        return files[0];
    };

    receiveInput = data => {
        console.log('receiveInput data', JSON.stringify(data, null, 4));
        this.setState(data);
    }

    render() {
        const {diff, source} = this.state;
        console.log('DIFF', diff);
        const file = this.parse(diff);
        // const file = this.parse(data.diff);

        // const file = false;

        console.warn('FILE', JSON.stringify(file));

        return (
            <div className={styles.root}>
                <InputArea onSubmit={this.receiveInput} />
                { !!file
                      && <Fragment>
                          <Configuration />
                          <DiffView
                              key={sha(diff) + (source ? sha(source) : '')}
                              type={file.type}
                              hunks={file.hunks}
                              oldSource={source}
                          />
                      </Fragment>
                }
            </div>
        );
    }
}

export default establishConfiguration('Configuration')(App);
