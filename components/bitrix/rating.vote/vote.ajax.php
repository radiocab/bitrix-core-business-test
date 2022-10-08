<?php

const PUBLIC_AJAX_MODE = true;
const NO_KEEP_STATISTIC = "Y";
const NO_AGENT_STATISTIC = "Y";
const NO_AGENT_CHECK = true;
const DisableEventsCheck = true;

use Bitrix\Main\Application;
use Bitrix\Main\Rating\Internal\Action;

/** @global CMain $APPLICATION */
/** @global CUser $USER */

require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

if (
	(string)$_POST['RATING_VOTE_TYPE_ID'] !== ''
	&& (int)$_POST['RATING_VOTE_ENTITY_ID'] > 0
	&& check_bitrix_sessid()
)
{
	$currentUserId = ($USER->isAuthorized() ? (int)$USER->getId() : 0);

	$key = 'rating.lock.'.$currentUserId;
	if (!Application::getConnection()->lock($key))
	{
		CMain::FinalActions();
	}

	$entityTypeId = $_POST['RATING_VOTE_TYPE_ID'];
	$entityId = (int)$_POST['RATING_VOTE_ENTITY_ID'];

	if ($_POST['RATING_VOTE_LIST'] === 'Y')
	{
		$APPLICATION->RestartBuffer();

		$params = [
			'ENTITY_TYPE_ID' => $entityTypeId,
			'ENTITY_ID' => $entityId,
			'LIST_PAGE' => (int)$_POST['RATING_VOTE_LIST_PAGE'],
			'LIST_LIMIT' => 20,
			'REACTION' => ($_POST['RATING_VOTE_REACTION'] ?? ''),
			'LIST_TYPE' => (
				isset($_POST['RATING_VOTE_LIST_TYPE'])
				&& $_POST['RATING_VOTE_LIST_TYPE'] === 'minus'
					? 'minus'
					: 'plus'
			),
			'PATH_TO_USER_PROFILE' => (
				!empty($_POST['PATH_TO_USER_PROFILE'])
					? $_POST['PATH_TO_USER_PROFILE']
					: '/people/user/#USER_ID#/'
			),
			'CURRENT_USER_ID' => $currentUserId,
			'CHECK_RIGHTS' => 'Y',
		];

		$voteList = Action::list($params);

		Header('Content-Type: application/x-javascript; charset=' . LANG_CHARSET);
		echo CUtil::PhpToJsObject($voteList);
	}
	else if ($_POST['RATING_VOTE'] === 'Y')
	{
		$params = [
			'ENTITY_TYPE_ID' => $entityTypeId,
			'ENTITY_ID' => $entityId,
			'ACTION' => (
				in_array($_POST['RATING_VOTE_ACTION'], [ 'plus', 'minus', 'change', 'cancel' ])
					? $_POST['RATING_VOTE_ACTION']
					: 'list'
			),
			'REACTION' => ($_POST['RATING_VOTE_REACTION'] ?? ''),
			'RATING_RESULT' => ($_POST['RATING_RESULT'] === 'Y' ? $_POST['RATING_RESULT'] : 'N'),
			'REMOTE_ADDR' => $_SERVER['REMOTE_ADDR'],
			'CURRENT_USER_ID' => $currentUserId,
			'CHECK_RIGHTS' => 'Y',
		];

		$ratingVoteResult = CRatings::getRatingVoteResult($params['ENTITY_TYPE_ID'], $params['ENTITY_ID']);
		if (!empty($ratingVoteResult))
		{
			$params['TOTAL_VALUE'] = $ratingVoteResult['TOTAL_VALUE'];
			$params['TOTAL_VOTES'] = $ratingVoteResult['TOTAL_VOTES'];
			$params['TOTAL_POSITIVE_VOTES'] = $ratingVoteResult['TOTAL_POSITIVE_VOTES'];
			$params['TOTAL_NEGATIVE_VOTES'] = $ratingVoteResult['TOTAL_NEGATIVE_VOTES'];
			$params['USER_HAS_VOTED'] = $ratingVoteResult['USER_HAS_VOTED'];
			$params['USER_VOTE'] = $ratingVoteResult['USER_VOTE'];
		}
		else
		{
			$params['TOTAL_VALUE'] = 0;
			$params['TOTAL_VOTES'] = 0;
			$params['TOTAL_POSITIVE_VOTES'] = 0;
			$params['TOTAL_NEGATIVE_VOTES'] = 0;
			$params['USER_HAS_VOTED'] = 'N';
			$params['USER_VOTE'] = '0';
		}

		$voteList = Action::vote($params);
		if (!empty($voteList))
		{
			Header('Content-Type: application/x-javascript; charset=' . LANG_CHARSET);
			echo CUtil::PhpToJsObject($voteList);
		}
	}
	else if ($_POST['RATING_RESULT'] === 'Y')
	{
		Header('Content-Type: application/x-javascript; charset=' . LANG_CHARSET);
		echo CUtil::PhpToJsObject(Action::getVoteResult($entityTypeId, $entityId));
	}

	Application::getConnection()->unlock($key);
}

CMain::FinalActions();
