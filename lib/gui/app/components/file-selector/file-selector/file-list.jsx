/*
 * Copyright 2018 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const React = require('react')
const propTypes = require('prop-types')
const styled = require('styled-components').default
const rendition = require('rendition')
const fontAwesome = require('@fortawesome/fontawesome')

const prettyBytes = require('pretty-bytes')
const files = require('../../../models/files')
const middleEllipsis = require('../../../utils/middle-ellipsis')

/**
 * @summary Flex styled component
 * @function
 * @type {ReactElement}
 */
const Flex = styled.div`
  display: flex;
  flex: ${ props => props.flex };
  flex-direction: ${ props => props.direction };
  justify-content: ${ props => props.justifyContent };
  align-items: ${ props => props.alignItems };
  flex-wrap: ${ props => props.wrap };
  flex-grow: ${ props => props.grow };
`

const FileListWrap = Flex.extend`
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 20px;
`

class FileList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      path: props.path,
      files: [],
    }
  }

  navigate (dirname) {
    console.log('FileList:navigate', dirname)
    files.readdirAsync(dirname).then((files) => {
      window.requestAnimationFrame(() => {
        this.setState({ files: files })
      })
    })
  }

  componentDidMount () {
    process.nextTick(() => {
      this.navigate(this.state.path)
    })
  }

  onHighlight (event) {
    // console.log('FileList:onHighlight', event)
  }

  onSelect (event) {
    console.log('FileList:onSelect', event.target)
    console.log('FileList:onSelect', event.target.dataset.path)
    this.navigate(event.target.dataset.path)
  }

  componentDidUpdate () {
    console.timeEnd('FileList:componentDidUpdate')
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log('FileList:shouldComponentUpdate', this.state.files !== nextState.files)
    console.time('FileList:componentDidUpdate')
    if (this.props.path !== nextProps.path) {
      this.navigate(nextProps.path)
    }
    return (this.state.files !== nextState.files)
  }

  render () {
    return (
      <FileListWrap wrap="wrap">
        <ul>
        {
          this.state.files.map((file) => {
            return (
              <li
                key={ file.path }
                data-path={ file.path }
                onClick={ ::this.onHighlight }
                onDoubleClick={ ::this.onSelect }>
                { file.basename }
              </li>
            )
          })
        }
        </ul>
      </FileListWrap>
    )
  }
}

FileList.propTypes = {
  path: propTypes.string,
  onNavigate: propTypes.func,
  constraints: propTypes.arrayOf(propTypes.string)
}

module.exports = FileList
