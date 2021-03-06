import React, { useState } from 'react'
import { Spinner } from 'vtex.styleguide'
import { SupportedLanguage } from 'langs'
import { IconGlobe } from 'vtex.store-icons'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime, Culture } from 'vtex.render-runtime'

import getLabel from './modules/getLabel'
import LocaleSwitcherList from './components/LocaleSwitcherList'

const CSS_HANDLES = [
  'list',
  'button',
  'container',
  'buttonText',
  'listElement',
  'localeIdText',
  'loadingContainer',
  'relativeContainer',
] as const

function parseToSupportedLang({ language, locale }: Culture) {
  return {
    text: getLabel(language),
    localeId: locale,
  }
}

const LocaleSwitcher: React.FC = () => {
  const { culture, emitter } = useRuntime()
  const [open, setOpen] = useState(false)
  const [shouldRenderList, setShouldRenderList] = useState(false)
  const [changingLocale, setChangingLocale] = useState(false)

  const [selectedLocale, setSelectedLocale] = useState(
    parseToSupportedLang(culture)
  )
  const handles = useCssHandles(CSS_HANDLES)

  const handleLocaleClick = (newLang: SupportedLanguage) => {
    setSelectedLocale(newLang)
    emitter.emit('localesChanged', newLang.localeId)
    setChangingLocale(true)
    setOpen(false)
  }

  const handleClick = () => {
    setOpen(!open)

    if (!shouldRenderList) {
      setShouldRenderList(true)
    }
  }

  const containerClasses = `${handles.container} w3 flex items-center justify-end ml2 mr3 relative`
  const buttonClasses = `${handles.button} link pa0 bg-transparent bn flex items-center pointer mr3 c-on-base`
  const buttonTextClasses = `${handles.buttonText} pl2 t-action--small order-1`

  return (
    <div className={containerClasses}>
      <div className={`${handles.relativeContainer} relative`}>
        <button
          onClick={handleClick}
          className={buttonClasses}
          onBlur={() => setOpen(false)}
        >
          {!changingLocale ? (
            <>
              <IconGlobe />
              <span className={buttonTextClasses}>{selectedLocale.text}</span>
            </>
          ) : (
            <Spinner handles={handles} size={26} />
          )}
        </button>
        {shouldRenderList && (
          <LocaleSwitcherList
            open={open}
            onItemClick={handleLocaleClick}
            selectedLocale={selectedLocale}
          />
        )}
      </div>
    </div>
  )
}

export default LocaleSwitcher
