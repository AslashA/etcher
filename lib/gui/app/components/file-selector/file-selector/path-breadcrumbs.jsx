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

const path = require('path')

const React = require('react')
const propTypes = require('prop-types')
const styled = require('styled-components').default
const rendition = require('rendition')
const fontAwesome = require('@fortawesome/fontawesome')

const middleEllipsis = require('../../../utils/middle-ellipsis')

function splitComponents(dirname, root) {
  const components = []
  let basename = null
  root = root || path.parse(dirname).root
  while( dirname !== root ) {
    basename = path.basename(dirname)
    components.unshift({
      path: dirname,
      basename: basename,
      name: basename === '/' ? 'Root' : basename
    })
    dirname = path.join( dirname, '..' )
  }
  return components
}

class Crumb extends React.PureComponent {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <rendition.Button
        onClick={ ::this.navigate }
        plaintext={ true }>
        <rendition.Txt bold={ this.props.bold }>
          { middleEllipsis(this.props.dir.name, 15) }
        </rendition.Txt>
      </rendition.Button>
    )
  }

  navigate () {
    this.props.navigate(this.props.dir.path)
  }
}

class UnstyledBreadcrumbs extends React.PureComponent {
  render () {
    const components = splitComponents(this.props.path)
    console.log('Breadcrumbs:components', components)
    return (
      <div className={ this.props.className }>
      {
        components.map((dir, index) => {
          return (
            <Crumb
              key={ dir.path }
              bold={ index === components.length - 1 }
              dir={ dir }
              navigate={ this.props.navigate }
            />
          )
        })
      }
      </div>
    )
  }
}

const Breadcrumbs = styled(UnstyledBreadcrumbs)`
  font-size: 18px;

  & > button:not(:last-child)::after {
    content: '/';
    margin: 9px;
  }
`

module.exports = Breadcrumbs
